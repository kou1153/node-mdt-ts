import { Request, Response } from "express";
import { MDT } from "./entity/MDT";
import { AppDataSource } from "./data-source";
import { validateMDT } from "./utils/joi-validate";

const mdtRepository = AppDataSource.getRepository(MDT);

const CreateMDT = async (
  req: Request<{
    hovaten: string;
    tkck: string;
    sdt: string;
    email: string;
    mdt: string;
  }>,
  res: Response
) => {
  const { error } = validateMDT(req.body);
  if (error) throw new Error(`${error.details[0].message}`);

  const newMDT: MDT = new MDT();

  newMDT.HoVaTen = req.body.hovaten;
  newMDT.TKCK = req.body.tkck;
  newMDT.SDT = req.body.sdt;
  newMDT.Email = req.body.email;
  newMDT.MDT = req.body.mdt;
  newMDT.DeletedAt = false;

  await mdtRepository.save(newMDT);

  res.json({ success: true, message: newMDT });
};

const GetAllMDT = async (req: Request, res: Response) => {
  const [allMDTs, allMDTsCount] = await mdtRepository.findAndCountBy({
    DeletedAt: false,
  });

  if (allMDTsCount === 0) {
    throw new Error("mdts is empty");
  }

  res.json({ success: true, message: allMDTs });
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
) => {
  const { error } = validateMDT(req.body);
  if (error) throw new Error(`${error.details[0].message}`);

  const updateMDT: MDT = await mdtRepository.findOneByOrFail({
    id: req.params.id,
  });

  updateMDT.HoVaTen = req.body.hovaten;
  updateMDT.TKCK = req.body.tkck;
  updateMDT.SDT = req.body.sdt;
  updateMDT.Email = req.body.email;
  updateMDT.MDT = req.body.mdt;
  updateMDT.DeletedAt = false;

  await mdtRepository.save(updateMDT);

  res.json({ success: true, message: updateMDT });
};

const DeleteMDT = async (req: Request<{ id: number }>, res: Response) => {
  const deleteMDT: MDT = await mdtRepository.findOneByOrFail({
    id: req.params.id,
  });

  deleteMDT.DeletedAt = true;

  await mdtRepository.save(deleteMDT);

  res.json({ success: true, message: deleteMDT });
};
const RandomMDT = async (req: Request, res: Response) => {
  const [allMDTs, allMDTsCount] = await mdtRepository.findAndCountBy({
    DeletedAt: false,
  });

  if (allMDTsCount === 0) {
    throw new Error("mdts is empty");
  }

  let randIndex: number = Math.floor(Math.random() * allMDTs.length);
  let chosenMDT: MDT = allMDTs[randIndex];

  const deleteMDT: MDT = await mdtRepository.findOneByOrFail({
    id: chosenMDT.id,
  });

  deleteMDT.DeletedAt = true;

  await mdtRepository.save(deleteMDT);

  res.json({ success: true, message: chosenMDT });
};

export { CreateMDT, GetAllMDT, UpdateMDT, DeleteMDT, RandomMDT };
