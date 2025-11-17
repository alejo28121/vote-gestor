#include <stdio.h>
#include <string.h>
#include "cJSON.h"

int main() {
    char buffer[4096];
    fread(buffer, 1, sizeof(buffer), stdin);
    cJSON *root = cJSON_Parse(buffer);
    char *user = cJSON_GetObjectItem(root, "user") -> valuestring;

    cJSON *resp = cJSON_CreateObject();
    cJSON_AddStringToObject(resp, "status", "ok");
    cJSON_AddStringToObject(resp, "mensaje", "User was registred");

    char *json = cJSON_Print(resp);
    printf("%s", json);
    return 0;
}

printf("");