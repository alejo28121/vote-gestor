#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

void VotesToJSON() {
    FILE *f;
    char linea[200];
    int primero = 1;

    f = fopen("Votes.csv", "r");
    if (f == NULL) {
        printf("Error: No se pudo abrir Votes.csv\n");
        return;
    }

    printf("{\n  \"votes\": [\n");

    // Leer cada línea del archivo 
    while (fgets(linea, sizeof(linea), f)) {

        // Quitar salto de linea 
        linea[strcspn(linea, "\n")] = 0;

        // Separar User y Candidato 
        char user[50];
        char candidato[50];

        int i = 0, j = 0, k = 0;
        int separador = 0;

        while (linea[i] != '\0') {
            if (linea[i] == ',') {
                separador = 1;
                i++;
                continue;
            }

            if (separador == 0) {
                user[j++] = linea[i];
            } else {
                candidato[k++] = linea[i];
            }
            i++;
        }

        user[j] = '\0';
        candidato[k] = '\0';

        // Imprimir coma entre objetos JSON 
        if (!primero) {
            printf(",\n");
        }
        primero = 0;

        // Imprimir objeto JSON 
        printf("    { \"user\": \"%s\", \"candidato\": \"%s\" }", user, candidato);
    }

    printf("\n  ]\n}\n");

    fclose(f);
}

int validarUsuario(char nombre[], char cedula[], char departamento[], char municipio[]) {
    FILE *f;
    char nom[50], cc[50], dep[50], mun[50];

    f = fopen("usuarios.txt", "r");

    // Si el archivo no existe, se considera que no hay registros 
    if (f == NULL) {
        return 1;  // OK - No existe el usuario
    }

    // Buscar si la cédula ya existe 
    while (fscanf(f, "%s %s %s %s", nom, cc, dep, mun) == 4) {
        if (strcmp(cc, cedula) == 0) {
            fclose(f);
            return 0;  // ERROR - Ya existe esa cedula
        }
    }

    fclose(f);
    return 1;  // OK - No existe, se puede registrar
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

    usersFile = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\users.csv", "r");
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

void trim(char *s) {
    int i = strlen(s) - 1;
    while (i >= 0 && (s[i] == ' ' || s[i] == '\r' || s[i] == '\n'))
        s[i--] = '\0';
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

    FILE *f = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes.csv", "r");
    if (!f) {
        printf("Error al abrir Votes.csv\n");
        return;
    }

    FILE *temp = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes_tmp.csv", "w");
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
    remove("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes.csv");
    rename(
        "C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes_tmp.csv",
        "C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes.csv"
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
    }

    return 0;
}
