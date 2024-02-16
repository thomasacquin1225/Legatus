import express, {Request, Response, NextFunction} from 'express';
import cors from 'cors';
import { dataSource } from './datasource';
import { GroupService } from "./groups/group.service";
import { Group } from "./groups/group";
import { Member } from "./groups/member";
import { GroupController } from "./groups/group.controller";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());


const groupRepository = dataSource.getRepository(Group)
const memberRepository = dataSource.getRepository(Member)
const groupService = new GroupService(groupRepository, memberRepository);
const groupController = new GroupController(groupService);
app.use("/group", groupController.router);

const errorMiddleware = (error: Error, _: Request, res: Response, next: NextFunction) => {
    try {
        res.status(500).json({ message: error.message });
    }
    catch (error) {
        next(error);
    }
}

app.use(errorMiddleware);

async function init() {
    await dataSource.initialize();
    await groupService.syncCachedGroups();
    // groupService.test();
    app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
}

init();
