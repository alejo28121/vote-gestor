#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

void ValidateUser() {
    FILE *usersFile;
    char userDb[50], pass[50], rol[20], voto[10];
    int found = 0;
    char buffer[4096];

    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin); 
    buffer[n] = '\0'; 
    cJSON *root = cJSON_Parse(buffer);
    if (!root) {
        fprintf(stderr, "Invalid JSON\n");
        return;
    }
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    cJSON *passwordItem = cJSON_GetObjectItem(root, "password");
    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        cJSON_Delete(root);
        return;
    }
    char *user = userItem->valuestring;
    if (!passwordItem || !cJSON_IsString(passwordItem)) {
        fprintf(stderr, "Missing or invalid 'password'\n");
        cJSON_Delete(root);
        return;
    }
    char *password = passwordItem->valuestring;
    usersFile = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\users.csv", "a+");
    if (!usersFile) {
        printf("No se pudo abrir el archivo.\n");
        return;
    }
    rewind(usersFile);

    while(fscanf(usersFile, "%49[^,],%49[^,],%49[^,],%9[^\n]\n", userDb, pass, rol, voto) == 4){
        if(strcmp(user, userDb) == 0 && strcmp(password, pass) == 0){
            found = 1;
            fclose(usersFile);
            break;
        }
    }
    cJSON *resp = cJSON_CreateObject();
    if (found == 1){
        cJSON_AddStringToObject(resp, "status", "ok");
        cJSON_AddStringToObject(resp, "mensaje", "User was logined");
        cJSON_AddStringToObject(resp, "user", user);
        char *json = cJSON_Print(resp);
        if (json) {
            printf("%s", json);
            cJSON_free(json);
        }
    }
    else{
        cJSON_AddStringToObject(resp, "status", "Invalid");
        cJSON_AddStringToObject(resp, "mensaje", "Incorrect user or password");
        char *json = cJSON_Print(resp);
        if (json) {
            printf("%s", json);
            cJSON_free(json);
        }
    }
    cJSON_Delete(resp);
    cJSON_Delete(root);
    fclose(usersFile);
}

// Segunda funcion que entrega Presidente 

void RegisVotes() {
    FILE *f;
    char user[50];
    int candidato;

    // Abrir o crear Votes.txt 
    f = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\Votes.txt", "a");
    if (!f) {
        printf("Error al crear o abrir Votes.txt\n");
        return;
    }

    // Pedir usuario 
    printf("Ingrese su usuario: ");
    scanf("%s", user);

    // Pedir número del candidato 
    printf("Ingrese el numero del candidato por el que vota: ");
    scanf("%d", &candidato);

    // Guardar en el archivo 
    fprintf(f, "%s %d\n", user, candidato);

    printf("Voto registrado correctamente.\n");

    fclose(f);

}

int main() {
    ValidateUser();
    return 0;
}