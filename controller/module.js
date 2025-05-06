import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const moduleCntl = async (req, res) => {
    const token = req.header("Authorization");

    if (!token) {
        return res.status(200).send({
            success: true,
            module: [],
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN);
        req.user = decoded;

        let modules = [];

        switch (req.user.role) {
            case "Manager":
                modules = [
                    { index: 1, title: "Gift" },
                    { index: 2, title: "Nozzle" },
                    { index: 3, title: "Sales" },
                    { index: 4, title: "Product" },
                    { index: 5, title: "Employee" },
                    { index: 6, title: "Task" },
                    { index: 7, title: "Inspection" },
                    { index: 8, title: "Purchase" },
                    { index: 9, title: "Finance"},
                    { index: 10, title: "Accounts"}
                ];
                break;
            case "Assistant_Manager":  
                modules = [
                    { index: 1, title: "Gift" },
                    { index: 2, title: "Nozzle" },
                    { index: 3, title: "Sales" },
                    { index: 4, title: "Product" },
                    { index: 5, title: "Employee" },
                    { index: 6, title: "Task" },
                    { index: 7, title: "Inspection" },
                    { index: 8, title: "Purchase" }
                ];
                break;
            case "Pump_Operator":
                modules = [
                    { index: 3, title: "Sales" },
                    { index: 6, title: "Task" }
                ];
                break;
            case "Technician":
            case "Cleaner":
                modules = [{ index: 6, title: "Task" }];
                break;
            case "Accountant":
                modules = [
                    { index: 3, title: "Sales" },
                    { index: 4, title: "Product" },
                    { index: 5, title: "Employee" },
                    { index: 6, title: "Task" },
                    { index: 8, title: "Purchase" },
                    { index: 9, title: "Transaction"},
                    { index: 9, title: "Finance"},
                    { index: 10, title: "Accounts"}
                ];
                break;
            default:
                modules = [];
                break;
        }
        console.log(modules);
        return res.status(200).send({
            success: true,
            module: modules,
        });

    } catch (error) {
        console.error("JWT Verification Failed:", error);
        return res.status(500).send({
            success: false,
            message: "Invalid or Expired Token",
            error: error.message,
        });
    }
};
