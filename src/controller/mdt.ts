import {Request, Response} from "express";
import {MDT} from "../database/model/MDT";
import {validateMDT} from "../utils/joi-validate";
import {GetConnection} from "../database/connection";
import {Repository} from "typeorm";
import {errorThrower} from "../utils/error-thrower";

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
    if (error) errorThrower(error, error.details[0].message);

    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT)
    const newMDT: MDT = new MDT();

    newMDT.HoVaTen = req.body.hovaten;
    newMDT.TKCK = req.body.tkck;
    newMDT.SDT = req.body.sdt;
    newMDT.Email = req.body.email;
    newMDT.MDT = req.body.mdt;
    newMDT.DeletedAt = false;

    await mdtRepository.save(newMDT).catch(e =>
        errorThrower(e, "Failed to query save create MDT")
    );

    res.json({success: true, message: newMDT});
};

const GetAllMDT = async (req: Request, res: Response): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT)
    const [allMDTs, allMDTsCount]: [MDT[], number] = await mdtRepository.findAndCountBy({
        DeletedAt: false,
    }).catch(e =>
        errorThrower(e, "Failed to find all mdt")
    );

    if (allMDTsCount === 0) {
        errorThrower(new Error("GetAllMDT() error"), "Mdts is empty")
    }

    res.json({success: true, message: allMDTs});
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
    if (error) errorThrower(error, error.details[0].message);

    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT)
    const updateMDT: MDT = await mdtRepository.findOneByOrFail({
        id: req.params.id,
    }).catch(e =>
        errorThrower(e, "Failed to find mdt to update with id", req.params.id)
    );

    updateMDT.HoVaTen = req.body.hovaten;
    updateMDT.TKCK = req.body.tkck;
    updateMDT.SDT = req.body.sdt;
    updateMDT.Email = req.body.email;
    updateMDT.MDT = req.body.mdt;
    updateMDT.DeletedAt = false;

    await mdtRepository.save(updateMDT).catch(e =>
        errorThrower(e, "Failed to query save updateMDT")
    );

    res.json({success: true, message: updateMDT});
};

const DeleteMDT = async (req: Request<{ id: number }>, res: Response): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT)
    const deleteMDT: MDT = await mdtRepository.findOneByOrFail({
        id: req.params.id,
    }).catch(e =>
        errorThrower(e, "Failed to find mdt to delete with id", req.params.id)
    );

    deleteMDT.DeletedAt = true;

    await mdtRepository.save(deleteMDT).catch(e =>
        errorThrower(e, "Failed to query save delete")
    );

    res.json({success: true, message: deleteMDT});
};
const RandomMDT = async (req: Request, res: Response): Promise<void> => {
    const mdtRepository: Repository<MDT> = GetConnection().getRepository(MDT)
    const [allMDTs, allMDTsCount]: [MDT[], number] = await mdtRepository.findAndCountBy({
        DeletedAt: false,
    }).catch(e =>
        errorThrower(e, "Failed to get random all mdts")
    );

    if (allMDTsCount === 0) {
        errorThrower(new Error("allMDTsCount() error"), "mdts is empty")
    }

    const randIndex: number = Math.floor(Math.random() * allMDTs.length);
    const chosenMDT: MDT = allMDTs[randIndex];

    const deleteMDT: MDT = await mdtRepository.findOneByOrFail({
        id: chosenMDT.id,
    }).catch(e =>
        errorThrower(e, "Failed to find mdt to delete in random mdt with id", chosenMDT.id)
    );

    deleteMDT.DeletedAt = true;

    await mdtRepository.save(deleteMDT).catch(e =>
        errorThrower(e, "Failed to query save delete chosen mdt")
    );

    res.json({success: true, message: chosenMDT});
};

export {CreateMDT, GetAllMDT, UpdateMDT, DeleteMDT, RandomMDT};
