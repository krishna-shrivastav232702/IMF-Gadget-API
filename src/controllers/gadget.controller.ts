import { Request, Response } from "express";
import { prismaClient } from "../index.js";
import { generateCodename } from "../utils/generateCodename.js";
import { generateVerificationCode } from "../utils/generateConfirmationCode.js";
import { generateSuccessProbability } from "../utils/generateMissionSuccessProbability.js";


enum GadgetStatus {
    Available = 'Available',
    Deployed = 'Deployed',
    Destroyed = 'Destroyed',
    Decommissioned = 'Decommissioned'
}

interface Gadget {
    id: string;
    name: string;
    status: "Available" | "Deployed" | "Destroyed" | "Decommissioned";
    selfDestructCode?: string | null;
    decommissionedAt?: Date | null;
    createdAt: Date;
}

export const getAllGadgets = async (req: Request, res: Response) => {
    try {
        const gadgets = await prismaClient.gadget.findMany({});

        const gadgetsWithSuccessProbability = gadgets.map((gadget: Gadget) => ({
            ...gadget,
            missionSuccessProbability: `${generateSuccessProbability()}%`
        }))
        res.status(200).json(gadgetsWithSuccessProbability);
    } catch (error) {
        console.error("Error fetching gadgets:", error);
        res.status(500).json({ message: "Failed to fetch gadgets" });
    }
}

export const addGadget = async (req: Request, res: Response) => {
    try {
        const codename = generateCodename() || "The Shakesphere";
        const gadgetResponse = await prismaClient.gadget.create({
            data: {
                name: codename,
            }
        })
        res.status(200).json(gadgetResponse);
    } catch (error) {
        console.error("Error adding gadget:", error);
        res.status(500).json({ message: "Failed to add gadget" });
    }
}

export const updateGadget = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { name, status } = req.body;
        const gadget = await prismaClient.gadget.update({
            where: { id },
            data: {
                name: name,
                status: status,
            }
        });
        res.status(200).json(gadget);
    } catch (error) {
        console.error("Error updating gadget:", error);
        res.status(500).json({ message: "Failed to update gadget" });
    }
}

export const removeGadget = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gadget = await prismaClient.gadget.update({
            where: { id },
            data: {
                status: "Decommissioned",
                decommissionedAt: new Date()
            }
        })
        res.status(200).json(gadget);
    } catch (error) {
        console.error("Error decommissioning status", error);
        res.status(500).json({ message: 'Failed to decommission gadget' });
    }
}

export const selfDestructGadget = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const gadget = await prismaClient.gadget.findUnique({
            where: { id }
        });
        if (!gadget) {
            res.status(404).json({ message: "Gadget not found" });
            return;
        }
        if (gadget.status === "Destroyed") {
            res.status(400).json({ message: "Gadget already destroyed" });
            return
        }
        const confirmationcode = generateVerificationCode();
        const destoyedGadget = await prismaClient.gadget.update({
            where: { id },
            data: {
                status: 'Destroyed',
                selfDestructCode: confirmationcode,
            }
        });

        res.status(200).json({ destoyedGadget, message: "Gadget self destruct completed" });
    } catch (error) {
        console.error("Error in self-destruct sequence:", error);
        res.status(500).json({ message: "Failed to execute self-destruct sequence" });
    }
}

export const getGadgetStatus = async (req: Request, res: Response) => {
    try {
        const status = req.query.status as string;
        if (!status) {
            res.status(400).json({ message: "Status parameter is required" });
            return;
        }
        if (!Object.values(GadgetStatus).includes(status as GadgetStatus)) {
            res.status(400).json({ message: "Invalid status value" });
            return;
        }

        const gadgets = await prismaClient.gadget.findMany({
            where: { status: status as GadgetStatus },
        });
        res.status(200).json(gadgets);
    } catch (error) {
        console.error("Error fetching gadgets:", error);
        res.status(500).json({ message: "Internal server error", error });
        return;
    }
}