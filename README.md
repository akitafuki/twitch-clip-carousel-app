# Twitch Clip Carousel

This project is a web application that displays a carousel of Twitch clips for a specified user.

## Features

*   Fetches and displays Twitch clips for a given channel.
*   Plays clips in a carousel format.
*   Includes a setup screen to configure the Twitch username.
*   AFK screen when the user is not interacting with the page.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need to have Node.js and npm installed on your machine.

### Installing

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/twitch-clip-carousel.git
    cd twitch-clip-carousel
    ```
2.  Install the dependencies:
    ```sh
    npm install
    ```
3.  Create a `.env` file in the root of the project and add your Twitch API credentials:
    ```
    REACT_APP_TWITCH_CLIENT_ID=your_client_id
    ```
4.  Start the development server:
    ```sh
    npm start
    ```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Built With

*   [React](https://reactjs.org/) - The web framework used
*   [TypeScript](https://www.typescriptlang.org/) - Language
*   [Docker](https://www.docker.com/) - Containerization
*   [Nginx](https://www.nginx.com/) - Web server

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.