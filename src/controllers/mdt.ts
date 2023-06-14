import {Request, Response} from "express";
import {MDT} from "../database/models/MDT";
import {validateMDT} from "../utils/joi-validate";
import {GetConnection} from "../database/connection";
import {Repository} from "typeorm";
import {CustomError} from "../utils/error-handler";
import {ApiResponse, createApiResponse} from "../utils/response-formatter";

const CreateMDT = async (
    req: Request<{
        hovaten: string;
        tkck: string;
        sdt: string;
        email: string;
        mdt: string;
    }>,
    res: Response
): Promise<void> => {
    const {error} = validateMDT(req.body);
    if (error) {
        throw new CustomError(400, error.details[0].message);
    }
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT);
    const newMDT: MDT = new MDT();
    newMDT.HoVaTen = req.body.hovaten;
    newMDT.TKCK = req.body.tkck;
    newMDT.SDT = req.body.sdt;
    newMDT.Email = req.body.email;
    newMDT.MDT = req.body.mdt;
    newMDT.DeletedAt = false;
    await mdtRepository.save(newMDT).catch(() => {
        throw new CustomError(500, "Failed to query save create MDT");
    });
    const response: ApiResponse = createApiResponse(true, newMDT);
    res.status(201).json(response);
};
const GetAllMDT = async (req: Request, res: Response): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT);
    const [allMDTs, allMDTsCount]: [MDT[], number] = await mdtRepository
        .findAndCount({
            where: {
                DeletedAt: false,
            },
        })
        .catch(() => {
            throw new CustomError(500, "Failed to find all mdt");
        });
    if (allMDTsCount === 0) {
        throw new CustomError(404, "Mdts is empty");
    }
    const response: ApiResponse = createApiResponse(true, allMDTs);
    res.status(200).json(response);
};
const UpdateMDT = async (
    req: Request<{
        id: number;
        hovaten: string;
        tkck: string;
        sdt: string;
        email: string;
        mdt: string;
    }>,
    res: Response
): Promise<void> => {
    const {error} = validateMDT(req.body);
    if (error) {
        throw new CustomError(400, error.details[0].message);
    }
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT);
    const updateMDT: MDT = await mdtRepository
        .findOneOrFail({
            where: {
                id: req.params.id,
            },
        })
        .catch(() => {
            throw new CustomError(
                404,
                `Failed to find mdt to update with id: ${req.params.id}`
            );
        });
    updateMDT.HoVaTen = req.body.hovaten;
    updateMDT.TKCK = req.body.tkck;
    updateMDT.SDT = req.body.sdt;
    updateMDT.Email = req.body.email;
    updateMDT.MDT = req.body.mdt;
    updateMDT.DeletedAt = false;
    await mdtRepository.save(updateMDT).catch(() => {
        throw new CustomError(500, "Failed to query save updateMDT");
    });
    const response: ApiResponse = createApiResponse(true, updateMDT);
    res.status(200).json(response);
};
const DeleteMDT = async (
    req: Request<{ id: number }>,
    res: Response
): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT);
    const deleteMDT: MDT = await mdtRepository
        .findOneOrFail({
            where: {
                id: req.params.id,
            },
        })
        .catch(() => {
            throw new CustomError(
                404,
                `Failed to find mdt to delete with id: ${req.params.id}`
            );
        });
    deleteMDT.DeletedAt = true;
    await mdtRepository.save(deleteMDT).catch(() => {
        throw new CustomError(500, "Failed to query save delete");
    });
    const response: ApiResponse = createApiResponse(true, deleteMDT);
    res.status(200).json(response);
};
const RandomMDT = async (req: Request, res: Response): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT);
    const [allMDTs, allMDTsCount]: [MDT[], number] = await mdtRepository
        .findAndCount({
            where: {
                DeletedAt: false,
            },
        })
        .catch(() => {
            throw new CustomError(500, "Failed to get random all mdts");
        });
    if (allMDTsCount === 0) {
        throw new CustomError(404, "Mdts is empty");
    }
    const randIndex: number = Math.floor(Math.random() * allMDTs.length);
    const chosenMDT: MDT = allMDTs[randIndex];
    chosenMDT.DeletedAt = true;
    await mdtRepository.save(chosenMDT).catch(() => {
        throw new CustomError(500, "Failed to query save delete chosen mdt");
    });
    const response: ApiResponse = createApiResponse(true, chosenMDT);
    res.status(200).json(response);
};
export {CreateMDT, GetAllMDT, UpdateMDT, DeleteMDT, RandomMDT};