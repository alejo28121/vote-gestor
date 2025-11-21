#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

void trim(char *s) {
    int i = strlen(s) - 1;
    while (i >= 0 && (s[i] == ' ' || s[i] == '\r' || s[i] == '\n'))
        s[i--] = '\0';
}

void RegisVotesCamara(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *candidateItem = cJSON_GetObjectItem(root, "candidate");

    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        return;
    }
    if (!candidateItem || !cJSON_IsString(candidateItem)) {
        fprintf(stderr, "Missing or invalid 'candidate'\n");
        return;
    }

    char *user = userItem->valuestring;
    char *candidate = candidateItem->valuestring;

    FILE *f = fopen("/home/ec2-user/votemanager/VotosCamara.csv", "r");
    if (!f) {
        printf("Error al abrir VotosCamara.csv\n");
        return;
    }

    FILE *temp = fopen("/home/ec2-user/votemanager/VotosCamara_tmp.csv", "w");
    if (!temp) {
        printf("Error al crear VotosCamara_tmp.csv\n");
        fclose(f);
        return;
    }

    char line[256];
    int found = 0;
    fprintf(temp, "candidate,votes\n");
    fgets(line, sizeof(line), f);

    while (fgets(line, sizeof(line), f)) {
        trim(line);
        char candidateA[128];
        char votesStr[64];
        int votes;

        if (sscanf(line, "%127[^,],%63[^\n]", candidateA, votesStr) == 2) {
            trim(candidateA); 
            trim(votesStr);

            if (strcmp(candidateA, candidate) == 0) {
                votes = atoi(votesStr) + 1;
                found = 1;
            } else {
                votes = atoi(votesStr);
            }

            char votesS[200];
            sprintf(votesS, "%d", votes);
            fprintf(temp, "%s,%s\n", candidateA, votesS);
        }
    }

    if (!found) {
        fprintf(temp,"%s,0\n", candidate);
    }

    fclose(f);
    fclose(temp);

    remove("/home/ec2-user/votemanager/VotosCamara.csv");

    rename(
        "/home/ec2-user/votemanager/VotosCamara_tmp.csv",
        "/home/ec2-user/votemanager/VotosCamara.csv"
    );

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "Voto registrado");
    cJSON_AddStringToObject(resp, "user", user);
    cJSON_AddStringToObject(resp, "candidate", candidate);

    char *json = cJSON_Print(resp);
    if (json) {
        printf("%s", json);
        cJSON_free(json);
    }

    cJSON_Delete(resp);
    cJSON_Delete(root);
    return;
}

/*
int validarUsuario() {
    FILE *f;

    f = fopen("users.csv", "r");
    if (f == NULL) {
        return 1;  
    }
    while (fscanf(f, "%s %s %s %s", nom, cc, dep, mun) == 4) {
        if (strcmp(cc, cedula) == 0) {
            fclose(f);
            return 0;  
        }
    }
    fclose(f);
    return 1;  
}
*/
void RegisUser(cJSON *root) {
    if (!root) return;

    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passItem = cJSON_GetObjectItem(root, "password");

    if (!userItem || !cJSON_IsString(userItem) ||
        !passItem || !cJSON_IsString(passItem)) 
    {
        fprintf(stderr, "{\"status\":\"error\",\"message\":\"Invalid JSON input\"}\n");
        return;
    }

    const char *id = userItem->valuestring;
    const char *password = passItem->valuestring;
    const char *role = "2";      
    const char *voted = "no";    

    FILE *f = fopen("/home/ec2-user/votemanager/users.csv", "r");
    int exists = 0;

    if (f) {
        char line[256];
        char uid[50], pass[50], roleFile[10], votedFile[10];

        fgets(line, sizeof(line), f);
        while (fgets(line, sizeof(line), f)) {
            line[strcspn(line, "\r\n")] = 0;
            if (sscanf(line, "%49[^,],%49[^,],%9[^,],%9s", uid, pass, roleFile, votedFile) == 4) {
                if (strcmp(uid, id) == 0) {
                    exists = 1;
                    break;
                }
            }
        }
        fclose(f);
    }

    cJSON *resp = cJSON_CreateObject();

    if (exists) {
        cJSON_AddStringToObject(resp, "status", "error");
        cJSON_AddStringToObject(resp, "message", "User already registered");
    } else {
        FILE *f2 = fopen("/home/ec2-user/votemanager/users.csv", "a");
        if (!f2) {
            cJSON_AddStringToObject(resp, "status", "error");
            cJSON_AddStringToObject(resp, "message", "Cannot open file to register user");
        } else {
            fseek(f2, 0, SEEK_END);
            if (ftell(f2) == 0) {
                fprintf(f2, "nombre,password,rol,voted\n");
            }
            fprintf(f2, "%s,%s,%s,%s\n", id, password, role, voted);
            fclose(f2);

            cJSON_AddStringToObject(resp, "status", "ok");
            cJSON_AddStringToObject(resp, "message", "User registered successfully");
        }
    }

    char *json = cJSON_Print(resp);
    if (json) {
        printf("%s\n", json);
        cJSON_free(json);
    }
    cJSON_Delete(resp);
}


void ValidateUser(cJSON *root) {
    FILE *usersFile;
    char userDb[50], pass[50], rol[20], voto[10];
    int found = 0;

    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passwordItem = cJSON_GetObjectItem(root, "password");

    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        cJSON_Delete(root);
        return;
    }
    if (!passwordItem || !cJSON_IsString(passwordItem)) {
        fprintf(stderr, "Missing or invalid 'password'\n");
        cJSON_Delete(root);
        return;
    }

    char *user = userItem->valuestring;
    char *password = passwordItem->valuestring;

    usersFile = fopen("/home/ec2-user/votemanager/users.csv", "r");
    if (!usersFile) {
        printf("No se pudo abrir el archivo.\n");
        return;
    }

    while (fscanf(usersFile, "%49[^,],%49[^,],%49[^,],%9[^\n]\n", userDb, pass, rol, voto) == 4) {
        if (strcmp(user, userDb) == 0 && strcmp(password, pass) == 0) {
            found = 1;
            break;
        }
    }

    fclose(usersFile);

    cJSON *resp = cJSON_CreateObject();
    if (found) {
        cJSON_AddStringToObject(resp, "status", "ok");
        cJSON_AddStringToObject(resp, "mensaje", "User was logined");
        cJSON_AddStringToObject(resp, "user", user);
        cJSON_AddStringToObject(resp, "rol", rol);
    } else {
        cJSON_AddStringToObject(resp, "status", "Invalid");
        cJSON_AddStringToObject(resp, "mensaje", "Incorrect user or password");
    }

    char *json = cJSON_Print(resp);
    if (json) {
        printf("%s", json);
        cJSON_free(json);
    }

    cJSON_Delete(resp);
    cJSON_Delete(root);
}

void RegisVotes(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *candidateItem = cJSON_GetObjectItem(root, "candidate");

    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        return;
    }
    if (!candidateItem || !cJSON_IsString(candidateItem)) {
        fprintf(stderr, "Missing or invalid 'candidate'\n");
        return;
    }

    char *user = userItem->valuestring;
    char *candidate = candidateItem->valuestring;

    FILE *f = fopen("/home/ec2-user/votemanager/Votes.csv", "r");
    if (!f) {
        printf("Error al abrir Votes.csv\n");
        return;
    }

    FILE *temp = fopen("/home/ec2-user/votemanager/Votes_tmp.csv", "w");
    if (!temp) {
        printf("Error al crear Votes_tmp.csv\n");
        fclose(f);
        return;
    }

    char line[256];
    int found = 0;
    fprintf(temp, "candidate,votes\n");
    fgets(line, sizeof(line), f);
    while (fgets(line, sizeof(line), f)) {
        trim(line);
        char candidateA[128];
        char votesStr[64];
        int votes;
        if (sscanf(line, "%127[^,],%63[^\n]", candidateA, votesStr) == 2) {
            trim(candidateA); 
            trim(votesStr);
            if (strcmp(candidateA, candidate) == 0) {
                votes = atoi(votesStr) + 1;
                found = 1;
            } else {
                votes = atoi(votesStr);
            }
            char votesS[200];
            sprintf(votesS, "%d", votes);
            fprintf(temp, "%s,%s\n", candidateA, votesS);
        }
    }
    if (!found) {
        fprintf(temp,"%s,0\n", candidate);
    }
    fclose(f);
    fclose(temp);
    remove("/home/ec2-user/votemanager/Votes.csv");
    rename(
        "/home/ec2-user/votemanager/Votes_tmp.csv",
        "/home/ec2-user/votemanager/Votes.csv"
    );
    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "Voto registrado");
    cJSON_AddStringToObject(resp, "user", user);
    cJSON_AddStringToObject(resp, "candidate", candidate);
    char *json = cJSON_Print(resp);
    if (json) {
        printf("%s", json);
        cJSON_free(json);
    }
    cJSON_Delete(resp);
    cJSON_Delete(root);
    return;
}

int main() {
    char buffer[4096];
    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin);
    buffer[n] = '\0';

    cJSON *root = cJSON_Parse(buffer);
    if (!root) {
        fprintf(stderr, "Invalid JSON\n");
        return 0;
    }

    cJSON *functionItem = cJSON_GetObjectItem(root, "function");
    if (!functionItem || !cJSON_IsString(functionItem)) {
        fprintf(stderr, "Missing or invalid 'function'\n");
        cJSON_Delete(root);
        return 0;
    }

    char *functionValue = functionItem->valuestring;

    if (strcmp(functionValue, "ValidateUser") == 0) {
        ValidateUser(root);
    } else if (strcmp(functionValue, "RegisVotes") == 0) {
        RegisVotes(root);
    }else if (strcmp(functionValue, "RegisUser") == 0) {
        RegisUser(root);
    }
    return 0;
}
