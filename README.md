# Real Time Collaborative Coding Application
A collaborative coding  system allows multiple users to edit codes at the same time. You can choose C++, Java or Python to execute codes in the system.



## Architecture
Stack   | Techs
---     | ---
Client  | Angular, Socket.IO
Server  | Node/Express, Socket.IO, Redis, MongoDB
Backend | Flask, Docker

![arch_image](/images/arch.jpg)



## Web Client
### Editor
We choose Ace editor as the edit environment, using socket.IO as the communication protocol between client and server to build the real-time editing service.

## Web Server
### Collaboration Editing
We keep the codes, list of participants, editing records, and cursor location. We store editing session in Redis, and all of users can work on the same edit session. When a user modify the code in the session, the other users' editors will be synchronized in time. Also, just like Google Document, a user can see other users' cursor location.


## Backend Server
### Code Execution Service (Flask + Docker)
We allow users to submit and run their codes. In the backend, we use Docker to build and run codes on Flask server. It supports to run C++, Java, and Python programs.

## Project Demo
### Main Page
![main_page](/images/main-page.png)

### Editor Page
![editor_page](/images/editor-page.png)
