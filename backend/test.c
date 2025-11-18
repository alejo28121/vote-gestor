#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

void ValidateUser() {
    FILE *f;
    char u[50], p[50];
    int encontrado = 0;
    char buffer[4096];
    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin); 
    buffer[n] = '\0'; 
    cJSON *root = cJSON_Parse(buffer);
    if (!root) {
        fprintf(stderr, "Invalid JSON\n");
        return;
    }
    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        cJSON_Delete(root);
        return;
    }
    char *user = userItem->valuestring;

    cJSON *passwordItem = cJSON_GetObjectItem(root, "password");
    if (!passwordItem || !cJSON_IsString(passwordItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        cJSON_Delete(root);
        return;
    }
    char *password = passwordItem->valuestring;

    // Si el archivo no existe, lo crea automáticamente 
    f = fopen("C:\\Users\\graja\\OneDrive\\Documentos\\Proyectos\\voteManager\\backend\\usuarios.txt", "a+");
    if (!f) {
        printf("No se pudo abrir el archivo.\n");
        return;
    }
    rewind(f);
    // Buscar usuario y contraseña
    while (fscanf(f, "%s %s", u, p) == 2) {
        if (strcmp(user, u) == 0 && strcmp(password, p) == 0) {
            encontrado = 1;
            break;
        }
    }

    if (encontrado == 1){
        cJSON *resp = cJSON_CreateObject();
        cJSON_AddStringToObject(resp, "status", "ok");
        cJSON_AddStringToObject(resp, "mensaje", "User was logined");
        char *json = cJSON_Print(resp);
        if (json) {
            printf("%s", json);
            cJSON_free(json);
        }
        cJSON_Delete(resp);
        cJSON_Delete(root);
    }
    else{
        cJSON *resp = cJSON_CreateObject();
        cJSON_AddStringToObject(resp, "status", "Invalid");
        cJSON_AddStringToObject(resp, "mensaje", "Incorrect user or password");
        char *json = cJSON_Print(resp);
        if (json) {
            printf("%s", json);
            cJSON_free(json);
        }
        cJSON_Delete(resp);
        cJSON_Delete(root);
    }
    fclose(f);
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