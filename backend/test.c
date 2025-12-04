#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

typedef struct {
    const char* name;
    const char* code;
} Municipio;

typedef struct {
    const char* name;
    const char* code;
    const Municipio* municipios;
    int municipios_count;
} Departamento;

void GetDepartamentos() {

    FILE *f = fopen("./municipios.csv", "r");
    if (!f) {
        printf("{\"status\":\"error\",\"msg\":\"No se pudo abrir departamentos.csv\"}");
        return;
    }

    char line[300];
    char deptName[120], deptCode[20], munName[120], munCode[20];

    cJSON *resp = cJSON_CreateObject();
    cJSON *deptArray = cJSON_CreateArray();

    typedef struct {
        char code[20];
        cJSON *deptObj;
        cJSON *munArray;
    } DeptItem;
    DeptItem list[200];
    int deptCount = 0;
    fgets(line, sizeof(line), f); 
    while (fgets(line, sizeof(line), f)) {
        if (sscanf(line, "%119[^,],%19[^,],%119[^,],%19[^\n]", deptName, deptCode, munName, munCode) == 4) {
            cJSON *deptObj = NULL;
            cJSON *munArray = NULL;
            int found = 0;
            for (int i = 0; i < deptCount; i++) {
                if (strcmp(list[i].code, deptCode) == 0) {
                    deptObj = list[i].deptObj;
                    munArray = list[i].munArray;
                    found = 1;
                    break;
                }
            }
            if (!found) {
                deptObj = cJSON_CreateObject();
                munArray = cJSON_CreateArray();

                cJSON_AddStringToObject(deptObj, "name", deptName);
                cJSON_AddStringToObject(deptObj, "code", deptCode);
                cJSON_AddItemToObject(deptObj, "municipios", munArray);

                cJSON_AddItemToArray(deptArray, deptObj);

                strcpy(list[deptCount].code, deptCode);
                list[deptCount].deptObj = deptObj;
                list[deptCount].munArray = munArray;
                deptCount++;
            }
            cJSON *munObj = cJSON_CreateObject();
            cJSON_AddStringToObject(munObj, "name", munName);
            cJSON_AddStringToObject(munObj, "code", munCode);

            cJSON_AddItemToArray(munArray, munObj);
        }
    }

    fclose(f);

    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddItemToObject(resp, "departamentos", deptArray);

    char *jsonOut = cJSON_Print(resp);
    printf("%s", jsonOut);

    free(jsonOut);
    cJSON_Delete(resp);
}

void EliminarCandidato(cJSON *root) {

    cJSON *candidateItem = cJSON_GetObjectItem(root, "candidate");
    if (!candidateItem || !candidateItem->valuestring) {
        printf("{\"status\":\"error\",\"msg\":\"Campo 'candidate' no encontrado\"}");
        return;
    }

    char *nombreBuscar = candidateItem->valuestring;

    FILE *f = fopen("Votes.csv", "r");
    FILE *temp = fopen("temp.csv", "w");

    char linea[300];
    int encontrado = 0;

    if (!f || !temp) {
        printf("{\"status\":\"error\",\"msg\":\"No se pudo abrir Votes.csv\"}");
        return;
    }

    fgets(linea, sizeof(linea), f);
    fprintf(temp, "%s", linea);

    while (fgets(linea, sizeof(linea), f)) {

        char candidate[120] = {0};
        int i = 0, j = 0;

        while (linea[i] != '\0' && linea[i] != ',' && linea[i] != '\n') {
            candidate[j++] = linea[i++];
        }
        candidate[j] = '\0';

        if (strcmp(candidate, nombreBuscar) == 0) {
            encontrado = 1;
            continue;
        }

        fprintf(temp, "%s", linea);
    }

    fclose(f);
    fclose(temp);

    remove("Votes.csv");
    rename("temp.csv", "Votes.csv");

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", encontrado ? "ok" : "not_found");
    cJSON_AddStringToObject(resp, "candidate", nombreBuscar);

    char *out = cJSON_Print(resp);
    printf("%s", out);

    cJSON_free(out);
    cJSON_Delete(resp);
    cJSON_Delete(root);
}

void RegisUser(cJSON *root) {
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passItem = cJSON_GetObjectItem(root, "password");
    cJSON *depaItem = cJSON_GetObjectItem(root, "departament");
    cJSON *muniItem = cJSON_GetObjectItem(root, "municipio");

    if (!userItem || !passItem) return;

    const char *id = userItem->valuestring;
    const char *password = passItem->valuestring;
    const char *departament = depaItem->valuestring;
    const char *municipio = muniItem->valuestring;

    FILE *f = fopen("./users.csv", "r");
    int exists = 0;

    if (f) {
        char line[256], uid[50], pass[50], roleFile[10], votedFile[10], departamentFile[10], municipioFile[10];

        fgets(line, sizeof(line), f);

        while (fgets(line, sizeof(line), f)) {
            line[strcspn(line, "\n")] = 0; 

            // uid,pass,role,voted
            if (sscanf(line, "%49[^,],%49[^,],%9[^,],%9s,%49[^,],%49[^,]",
                       uid, pass, roleFile, votedFile, departamentFile, municipioFile) == 4) {

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
            // user,password,role,voted
            fprintf(f2, "%s,%s,2,no,%s,%s\n", id, password, departament, municipio);
            fclose(f2);

            cJSON_AddStringToObject(resp, "status", "ok");
            cJSON_AddStringToObject(resp, "message", "User registered");
            cJSON_AddStringToObject(resp, "user", id);
        }
    }

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);
    cJSON_Delete(resp);
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

void RegisCandidate(cJSON *root) {

    cJSON *tipoItem = cJSON_GetObjectItem(root, "tipo");
    cJSON *nameItem = cJSON_GetObjectItem(root, "name");
    cJSON *imgItem  = cJSON_GetObjectItem(root, "img");

    if (!tipoItem || !nameItem || !imgItem) {
        printf("ERROR: Faltan datos en el JSON\n");
        return;
    }

    if (!cJSON_IsString(tipoItem) || 
        !cJSON_IsString(nameItem) || 
        !cJSON_IsString(imgItem)) {

        printf("ERROR: Datos invalidos\n");
        return;
    }

    const char *tipo = tipoItem->valuestring;
    const char *name = nameItem->valuestring;
    const char *img  = imgItem->valuestring;

    FILE *f = fopen("./Votes.csv", "r");
    int exists = 0;

    if (f) {
        char line[300], candidateFile[150], tipoFile[20], imgFile[100];
        int votesFile;

        fgets(line, sizeof(line), f); // Saltar encabezado

        while (fgets(line, sizeof(line), f)) {

            line[strcspn(line, "\n")] = 0; // quitar \n

            // candidate,tipo,votes,img
            if (sscanf(line, "%149[^,],%d,%19[^,],%99[^,]", candidateFile, &votesFile, tipoFile, imgFile) == 4) {

                if (strcmp(candidateFile, name) == 0) {
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
        cJSON_AddStringToObject(resp, "message", "Candidate already exists");
    } else {
        FILE *f2 = fopen("./Votes.csv", "a");
        if (!f2) {
            cJSON_AddStringToObject(resp, "status", "error");
            cJSON_AddStringToObject(resp, "message", "Cannot open Votes.csv");
        } else {
            // candidate,tipo,votes,img
            fprintf(f2, "%s,0,%s,%s\n", name, tipo, img);
            fclose(f2);

            cJSON_AddStringToObject(resp, "status", "ok");
            cJSON_AddStringToObject(resp, "message", "Candidate registered");
            cJSON_AddStringToObject(resp, "candidate", name);
        }
    }

    char *json = cJSON_Print(resp);
    printf("%s", json);
    cJSON_free(json);
    cJSON_Delete(resp);
}


void ValidateUser(cJSON *root) {
    char userDb[50], pass[50], rol[20], voto[10], depa[10], muni[10];
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

    while (fscanf(usersFile, "%49[^,],%49[^,],%49[^,],%9[^,],%49[^,],%49[^\n]\n", userDb, pass, rol, voto, depa, muni) == 6) {

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
        cJSON_AddStringToObject(resp, "departament", depa);
        cJSON_AddStringToObject(resp, "municipio", muni);
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

    fprintf(temp, "candidate,votes,tipo,img\n");
    fgets(line, sizeof(line), f); 

    while (fgets(line, sizeof(line), f)) {
        trim(line);

        char candidateA[128] = {0}, votesStr[32] = {0}, tipoStr[16] = {0}, img[64] = {0};
        int votes, tipo;

        if (sscanf(line, "%127[^,],%31[^,],%15[^,],%63[^\n]", candidateA, votesStr, tipoStr, img) == 4) {
            trim(candidateA);
            trim(votesStr);
            trim(tipoStr);
            trim(img);

            if (strcmp(candidateA, candidate) == 0) {
                votes = atoi(votesStr) + 1;
                found = 1;
            } else {
                votes = atoi(votesStr);
            }

            tipo = atoi(tipoStr);

            fprintf(temp, "%s,%d,%d,%s\n", candidateA, votes, tipo, img);
        }
    }

    if (!found) {
        fprintf(temp, "%s,1,1,default.svg\n", candidate);
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

        if (sscanf(line, "%49[^,],%49[^,],%9[^,],%9s", userDb, pass, rol, voted) == 4) {

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
    } else if (strcmp(functionValue, "ValidateVote") == 0) {
        ValidateVote(root);
    } else if (strcmp(functionValue, "RegisCandidate") == 0) {
        RegisCandidate(root);
    } else if (strcmp(functionValue, "EliminarCandidato") == 0) {
        EliminarCandidato(root);
    } else if (strcmp(functionValue, "GetDepartamentos") == 0) {
        GetDepartamentos();
    }
    return 0;
}
