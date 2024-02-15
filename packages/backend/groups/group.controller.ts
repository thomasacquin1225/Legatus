import { Router, Request, Response, NextFunction} from "express";
import { GroupService } from "./group.service";

export class GroupController {
    public router: Router
    constructor(
        private groupService: GroupService
    ) {
        this.router = Router();
        this.router.post("/", this.createGroup);
        this.router.get("/:id", this.getGroup);
        this.router.get("/:id/fingerprint", this.getGroupFingerprint);
        this.router.post("/:id/member", this.addMember);
        this.router.delete("/:id/member", this.removeMember);
        console.log("Router setup complete")
    }

    getGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const group = await this.groupService.getGroup(id);
            res.status(200).json(group);
        } catch (err) {
            next(err)
        }
    }

    createGroup = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const treeDepth = req.body.treeDepth || 30;
            const members = req.body.members || [];
            const group = await this.groupService.createGroup(treeDepth, members);
            res.status(200).json(group);
        } catch (err) {
            next(err)
        }
    }

    getGroupFingerprint = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const groupRoot = this.groupService.getGroupFingerprint(id);
            res.status(200).json({fingerprint: groupRoot});
        } catch (err) {
            next(err)
        }
    }

    addMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const memberId: string = req.body.memberId;
            await this.groupService.addMember(id, memberId);
            res.status(200).json({success: true});
        } catch (err) {
            next(err)
        }
    }

    removeMember = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = parseInt(req.params.id);
            const memberId: string = req.body.memberId;
            await this.groupService.removeMember(id, memberId);
            res.status(200).json({success: true});
        } catch (err) {
            next(err)
        }
    }

}
