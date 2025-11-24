#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

// Funcion Recibe JSON 
void RecibirJson(cJSON *root) {

    cJSON *idItem   = cJSON_GetObjectItem(root, "id");
    cJSON *nameItem = cJSON_GetObjectItem(root, "name");
    cJSON *imgItem  = cJSON_GetObjectItem(root, "img");

    if (!idItem || !nameItem || !imgItem) {
        printf("ERROR: Faltan datos en el JSON\n");
        return;
    }

    if (!cJSON_IsString(idItem) || !cJSON_IsString(nameItem) || !cJSON_IsString(imgItem)) {
        printf("ERROR: Datos invalidos\n");
        return;
    }

    char *id   = idItem->valuestring;
    char *name = nameItem->valuestring;
    char *img  = imgItem->valuestring;

    printf("----- DATOS RECIBIDOS -----\n");
    printf("ID: %s\n", id);
    printf("Nombre: %s\n", name);
    printf("Imagen: %s\n", img);
}

int main() {

    // JSON de ejemplo (simula el que envias)
    char jsonText[] = "{ \"id\" : \"Any number\", \"name\" : \"Something\", \"img\" : \"Something\" }";

    // Convertir texto a JSON
    cJSON *root = cJSON_Parse(jsonText);

    if (!root) {
        printf("Error al leer el JSON\n");
        return 0;
    }

    // Llamar a la funcion
    RecibirJson(root);

    // Liberar memoria
    cJSON_Delete(root);

    return 0;
}

void trim(char *s) {
    int i = strlen(s) - 1;
    while (i >= 0 && (s[i] == ' ' || s[i] == '\r' || s[i] == '\n'))
        s[i--] = '\0';
}

void RegisVotesCamara(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *candidateItem = cJSON_GetObjectItem(root, "candidate");

    if (!userItem || !candidateItem) return;

    char *user = userItem->valuestring;
    char *candidate = candidateItem->valuestring;

    FILE *f = fopen("./VotosCamara.csv", "r");
    if (!f) {
        printf("Error al abrir VotosCamara.csv\n");
        return;
    }

    FILE *temp = fopen("./VotosCamara_tmp.csv", "w");
    if (!temp) {
        printf("Error al crear VotosCamara_tmp.csv\n");
        fclose(f);
        return;
    }

    char line[256];
    int found = 0;

    fprintf(temp, "candidate,votes\n");
    fgets(line, sizeof(line), f); // Skip header

    while (fgets(line, sizeof(line), f)) {
        trim(line);
        char candidateA[128], votesStr[64];
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

            fprintf(temp, "%s,%d\n", candidateA, votes);
        }
    }

    if (!found) {
        fprintf(temp, "%s,1\n", candidate);
    }

    fclose(f);
    fclose(temp);

    remove("./VotosCamara.csv");
    rename("./VotosCamara_tmp.csv", "./VotosCamara.csv");

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "Voto registrado");
    cJSON_AddStringToObject(resp, "user", user);
    cJSON_AddStringToObject(resp, "candidate", candidate);

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);

    cJSON_Delete(resp);
    cJSON_Delete(root);
}

void RegisUser(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passItem = cJSON_GetObjectItem(root, "password");

    if (!userItem || !passItem) return;

    const char *id = userItem->valuestring;
    const char *password = passItem->valuestring;

    FILE *f = fopen("./users.csv", "r");
    int exists = 0;

    if (f) {
        char line[256], uid[50], pass[50], roleFile[10], votedFile[10];

        fgets(line, sizeof(line), f); // Skip header

        while (fgets(line, sizeof(line), f)) {
            line[strcspn(line, "\n")] = 0;
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
        FILE *f2 = fopen("./users.csv", "a");
        if (!f2) {
            cJSON_AddStringToObject(resp, "status", "error");
            cJSON_AddStringToObject(resp, "message", "Cannot open users.csv");
        } else {
            fprintf(f2, "%s,%s,2,no\n", id, password);
            fclose(f2);

            cJSON_AddStringToObject(resp, "status", "ok");
            cJSON_AddStringToObject(resp, "message", "User registered");
        }
    }

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);
    cJSON_Delete(resp);
}

void ValidateUser(cJSON *root) {
    char userDb[50], pass[50], rol[20], voto[10];
    int found = 0;

    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passwordItem = cJSON_GetObjectItem(root, "password");

    if (!userItem || !passwordItem) return;

    char *user = userItem->valuestring;
    char *password = passwordItem->valuestring;

    FILE *usersFile = fopen("./users.csv", "r");
    if (!usersFile) {
        printf("No se pudo abrir users.csv");
        return;
    }

    char header[256];
    fgets(header, sizeof(header), usersFile);  

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
    printf("%s", json);
    cJSON_free(json);

    cJSON_Delete(resp);
    cJSON_Delete(root);
}

void RegisVotes(cJSON *root) {
    FILE *f = fopen("./Votes.csv", "r");
    if (!f) {
        printf("Error al abrir Votes.csv\n");
        return;
    }

    FILE *temp = fopen("./Votes_tmp.csv", "w");
    if (!temp) {
        printf("Error al crear Votes_tmp.csv\n");
        fclose(f);
        return;
    }

    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *candidateItem = cJSON_GetObjectItem(root, "candidate");

    char *user = userItem->valuestring;
    char *candidate = candidateItem->valuestring;

    char line[256];
    int found = 0;

    fprintf(temp, "candidate,votes\n");
    fgets(line, sizeof(line), f); // Skip header

    while (fgets(line, sizeof(line), f)) {
        trim(line);

        char candidateA[128], votesStr[64];
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

            fprintf(temp, "%s,%d\n", candidateA, votes);
        }
    }

    if (!found) {
        fprintf(temp, "%s,1\n", candidate);
    }

    fclose(f);
    fclose(temp);

    remove("./Votes.csv");
    rename("./Votes_tmp.csv", "./Votes.csv");

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "Voto registrado");
    cJSON_AddStringToObject(resp, "user", user);
    cJSON_AddStringToObject(resp, "candidate", candidate);

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);

    cJSON_Delete(resp);
    cJSON_Delete(root);
}

void ValidateVote(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");

    if (!userItem) return;

    char *user = userItem->valuestring;

    FILE *f = fopen("./users.csv", "r");
    if (!f) {
        printf("{\"status\":\"error\",\"mensaje\":\"No se pudo abrir users.csv\"}");
        return;
    }

    char line[256];
    char userDb[50], pass[50], rol[10], voted[10];
    int found = 0;

    fgets(line, sizeof(line), f); // skip header

    while (fgets(line, sizeof(line), f)) {
        line[strcspn(line, "\n")] = 0;

        if (sscanf(line, "%49[^,],%49[^,],%9[^,],%9s",
                   userDb, pass, rol, voted) == 4) {

            if (strcmp(userDb, user) == 0) {
                found = 1;
                break;
            }
        }
    }

    fclose(f);

    cJSON *resp = cJSON_CreateObject();

    if (!found) {
        cJSON_AddStringToObject(resp, "status", "error");
        cJSON_AddStringToObject(resp, "mensaje", "Usuario no encontrado");
    } else {
        cJSON_AddStringToObject(resp, "status", "ok");
        cJSON_AddStringToObject(resp, "user", user);
        cJSON_AddStringToObject(resp, "voted", voted);
    }

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);

    cJSON_Delete(resp);
    cJSON_Delete(root);
}


int main() {
    char buffer[4096];
    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin);
    buffer[n] = '\0';

    cJSON *root = cJSON_Parse(buffer);
    if (!root) return 0;

    cJSON *functionItem = cJSON_GetObjectItem(root, "function");
    if (!functionItem) {
        cJSON_Delete(root);
        return 0;
    }

    char *functionValue = functionItem->valuestring;

    if (strcmp(functionValue, "ValidateUser") == 0) {
        ValidateUser(root);
    } else if (strcmp(functionValue, "RegisVotes") == 0) {
        RegisVotes(root);
    } else if (strcmp(functionValue, "RegisVotesCamara") == 0) {
        RegisVotesCamara(root);
    } else if (strcmp(functionValue, "RegisUser") == 0) {
        RegisUser(root);
    }
     else if (strcmp(functionValue, "ValidateVote") == 0) {
        ValidateVote(root);
    }

    return 0;
}
