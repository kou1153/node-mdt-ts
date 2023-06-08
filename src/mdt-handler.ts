import { Request, Response } from "express";
import { AsyncHandler } from "./utils/async-handler";
import { MDT } from "./entity/MDT";
import { DbInstance } from "./db-connection";

const mdtRepository = DbInstance.getRepository(MDT);
console.log("🚀 ~ file: mdt-handler.ts:7 ~ mdtRepository:", mdtRepository)

const CreateMDT = AsyncHandler(
  async (
    req: Request<{
      hovaten: string;
      tkck: string;
      sdt: string;
      email: string;
      mdt: string;
    }>,
    res: Response
  ) => {
    const newMDT: MDT = new MDT();

    newMDT.HoVaTen = req.body.hovaten;
    newMDT.TKCK = req.body.tkck;
    newMDT.SDT = req.body.sdt;
    newMDT.Email = req.body.email;
    newMDT.MDT = req.body.mdt;
    newMDT.DeletedAt = false;

    await mdtRepository.save(newMDT);

    res.json({ success: true, message: newMDT });
  }
);

const GetAllMDT = AsyncHandler(async (req: Request, res: Response) => {
  const allMDTs: Array<MDT> = await mdtRepository.find({
    where: { DeletedAt: false },
  });

  res.json({ success: true, message: allMDTs });
});

const UpdateMDT = AsyncHandler(
  async (
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
    const updateMDT: MDT = await mdtRepository.findOneBy({
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
  }
);

const DeleteMDT = AsyncHandler(
  async (req: Request<{ id: number }>, res: Response) => {
    const deleteMDT: MDT = await mdtRepository.findOneBy({
      id: req.params.id,
    });

    deleteMDT.DeletedAt = true;

    await mdtRepository.save(deleteMDT);

    res.json({ success: true, message: deleteMDT });
  }
);

const RandomMDT = AsyncHandler(async (req: Request, res: Response) => {
  const allMDTs: Array<MDT> = await mdtRepository.find({
    where: { DeletedAt: false },
  });

  let randIndex: number = Math.floor(Math.random() * allMDTs.length);
  let chosenMDT: MDT = allMDTs[randIndex];

  const deleteMDT: MDT = await mdtRepository.findOneBy({
    id: chosenMDT.id,
  });

  deleteMDT.DeletedAt = true;

  await mdtRepository.save(deleteMDT);

  res.json({ success: true, message: chosenMDT });
});

export { CreateMDT, GetAllMDT, UpdateMDT, DeleteMDT, RandomMDT };
