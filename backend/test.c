#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>

#define PORT 8080

int main() {
    int server_fd, new_socket;
    struct sockaddr_in address;
    int addrlen = sizeof(address);
    char buffer[1024] = {0};
    char *response = "HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\n\r\nHello from C backend!";

    server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if (server_fd == 0) { perror("socket failed"); exit(EXIT_FAILURE); }

    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(PORT);

    if (bind(server_fd, (struct sockaddr *)&address, sizeof(address)) < 0) { perror("bind failed"); exit(EXIT_FAILURE); }

    if (listen(server_fd, 3) < 0) { perror("listen"); exit(EXIT_FAILURE); }

    printf("Server running on port %d\n", PORT);

    while(1) {
        new_socket = accept(server_fd, (struct sockaddr *)&address, (socklen_t*)&addrlen);
        read(new_socket, buffer, 1024);
        write(new_socket, response, strlen(response));
        close(new_socket);
    }

    return 0;
}
