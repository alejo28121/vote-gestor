#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "cJSON.h"

#ifdef _WIN32
#include <windows.h>
#else
#include <unistd.h>
#endif

void trim(char *s) {
    int i = strlen(s) - 1;
    while (i >= 0 && (s[i] == ' ' || s[i] == '\r' || s[i] == '\n'))
        s[i--] = '\0';
}

void VotesToJSON() {
    while (1) {
        FILE *f = fopen("Votes.csv", "r");
        if (!f) {
            fprintf(stderr, "{\"error\": \"No se pudo abrir Votes.csv\"}\n");
#ifdef _WIN32
            Sleep(1000);
#else
            usleep(1000 * 1000);
#endif
            continue;
        }

        char linea[200];

        cJSON *root = cJSON_CreateObject();
        cJSON *array = cJSON_CreateArray();
        cJSON_AddItemToObject(root, "votes", array);
        fgets(linea, sizeof(linea), f);

        while (fgets(linea, sizeof(linea), f)) {
            trim(linea);

            char candidate[100] = {0};
            char votesStr[20] = {0};

            int i = 0, j = 0, k = 0;
            int separador = 0;

            while (linea[i] != '\0') {
                if (linea[i] == ',') {
                    separador = 1;
                    i++;
                    continue;
                }
                if (!separador)
                    candidate[j++] = linea[i];
                else
                    votesStr[k++] = linea[i];
                i++;
            }
            candidate[j] = '\0';
            votesStr[k] = '\0';

            int votes = atoi(votesStr);

            cJSON *obj = cJSON_CreateObject();
            cJSON_AddStringToObject(obj, "candidate", candidate);
            cJSON_AddNumberToObject(obj, "votes", votes);
            cJSON_AddItemToArray(array, obj);
        }

        fclose(f);

        char *json = cJSON_PrintUnformatted(root); 
        printf("%s\n", json);
        fflush(stdout); 

        free(json);
        cJSON_Delete(root);

#ifdef _WIN32
        Sleep(1000);
#else
        usleep(1000 * 1000);
#endif
    }
}

int main() {
    VotesToJSON();
    return 0; 
}
