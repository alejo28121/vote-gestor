#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

void ValidateUser() {
    FILE *f;
    char usuario[50], password[50];
    char u[50], p[50];
    int encontrado = 0;

    // Si el archivo no existe, lo crea automáticamente 
    f = fopen("usuarios.txt", "a+");
    if (!f) {
        printf("No se pudo abrir el archivo.\n");
        return;
    }

    // Pedir datos al usuario 
    printf("Ingrese usuario: ");
    scanf("%s", usuario);

    printf("Ingrese contrasena: ");
    scanf("%s", password);

    // Regresar al inicio del archivo
    rewind(f);

    // Buscar usuario y contraseña
    while (fscanf(f, "%s %s", u, p) == 2) {
        if (strcmp(usuario, u) == 0 && strcmp(password, p) == 0) {
            encontrado = 1;
            break;
        }
    }

    if (encontrado == 1)
        printf("OK\n");
    else
        printf("Invalido\n");

    fclose(f);
}

// Segunda funcion que entrega Presidente 

void RegisVotes() {
    FILE *f;
    char user[50];
    int candidato;

    // Abrir o crear Votes.txt 
    f = fopen("Votes.txt", "a");
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
    char buffer[4096];
    size_t n = fread(buffer, 1, sizeof(buffer) - 1, stdin); // dejar espacio para \0
    buffer[n] = '\0'; // terminar string

    cJSON *root = cJSON_Parse(buffer);
    if (!root) {
        fprintf(stderr, "Invalid JSON\n");
        return 1;
    }

    cJSON *userItem = cJSON_GetObjectItem(root, "user");
    if (!userItem || !cJSON_IsString(userItem)) {
        fprintf(stderr, "Missing or invalid 'user'\n");
        cJSON_Delete(root);
        return 1;
    }

    char *user = userItem->valuestring;

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "User was registred");

    char *json = cJSON_Print(resp);
    if (json) {
        printf("%s", json);
        cJSON_free(json);
    }

    cJSON_Delete(resp);
    cJSON_Delete(root);
    return 0;
}

