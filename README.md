# Debt Tracker System

A web-based application designed to simplify loan management for lenders and borrowers. This system automates interest calculations, tracks payment schedules, and provides detailed reports, making financial management efficient and transparent.

---

## Features

- **Borrower Management**: Manage borrower profiles and loan details.
- **Automated Calculations**: Real-time balance updates and interest calculations.
- **Payment Notifications**: Automated reminders for payment deadlines and overdue amounts.
- **Reporting**: Detailed analytics for lenders to monitor financial performance.

---

## Project Structure

This project has two main directories:

1. **Frontend**

   - Built using React.js for an intuitive and responsive user interface.
   - Includes components for borrower management, payment schedules, and dashboards.

2. **Backend**
   - Developed using Node.js and Express.js to handle APIs and business logic.
   - Uses MongoDB for database management.

---

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB installed or access to a MongoDB cloud instance.

### Steps

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/VTRanathunga1998/debt-tracking-system.git
   cd debt-tracker
   ```

2. **Setup Backend**:

   ```bash
   cd backend
   npm install
   ```

   - Configure your MongoDB URI in a `.env` file:
     ```
     MONGO_URI=your-mongodb-uri
     PORT=5000
     ```
   - Start the backend server:
     ```bash
     npm start
     ```

3. **Setup Frontend**:

   ```bash
   cd ../frontend
   npm install
   ```

   - Start the frontend development server:
     ```bash
     npm start
     ```

4. **Access the Application**:
   - Open your browser and navigate to `http://localhost:3000`.

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear and descriptive messages.
4. Push to your fork and create a pull request.

For detailed contribution guidelines, refer to the `CONTRIBUTING.md` file.

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for more details.

---

## Acknowledgments

- Built with React.js, Node.js, Express.js, and MongoDB.
- Inspired by the need for efficient loan management systems.

---

## Contact

For questions or support, feel free to reach out at: [virajtharuka.fb@gmail.com]
