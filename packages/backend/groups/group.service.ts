import { Repository } from "typeorm";
import { Group } from "./group";
import { Group  as CachedGroup } from "@semaphore-protocol/group";
import { Member } from "./member";
import { Signal } from "./signal";

export class GroupService {
    private cachedGroups: Map<number, CachedGroup>;

    constructor(
        private groupRepository: Repository<Group>,
        private memberRepository: Repository<Member>,
        private signalRepository: Repository<Signal>
    ) {
        this.cachedGroups = new Map();
    }

    async syncCachedGroups() {
        const groups = await this.groupRepository.find({relations: {members: true}});
        for (const g of groups) {
            const members = g.members?.map((member) => member.id);
            const cachedGroup = new CachedGroup(g.id, g.treeDepth, members);
            this.cachedGroups.set(g.id, cachedGroup);
        }
        console.log("Semaphore Groups Loaded");
    }

    async getMember(memberId: string) {
        try {
            BigInt(memberId);
        } catch (_) {
            throw new Error("Member ID must be a bigint");
        }
        let member = await this.memberRepository.findOne({
            where: {
                id: memberId
            }
        });
        if (!member) {
            member = await this.memberRepository.save(new Member(memberId));
        }
        return member;
    }

    async createGroup(treeDepth: number = 30, memberIds: string[] = []): Promise<Group> {
        if (treeDepth < 16 || treeDepth > 32) {
            throw new Error("The tree depth must be between 16 and 32");
        }
        const members = await Promise.all(memberIds.map(async (memberId) => await this.getMember(memberId)));
        const newGroup = new Group(treeDepth, members);
        const savedGroup = await this.groupRepository.save(newGroup);
        const id = savedGroup.id;
        const cachedGroup = new CachedGroup(id, treeDepth, memberIds);
        this.cachedGroups.set(id, cachedGroup);
        return savedGroup;
    }

    async getGroup(groupId: number) {
        const group = await this.groupRepository.findOne({
            where: { id: groupId },
            relations: { members: true }
        });
        if (!group) {
            throw new Error("Group not found");
        }
        return group;
    }

    async addMember(groupId: number, memberId: string) {
        const group = await this.getGroup(groupId);
        if (group.members.find((m) => m.id == memberId)) {
            throw new Error("Member already exists");
        }
        const member = await this.getMember(memberId);
        group.members.push(member);
        await this.groupRepository.save(group);
        const cachedGroup = this.cachedGroups.get(groupId);
        cachedGroup?.addMember(memberId);
    }

    async removeMember(groupId: number, memberId: string) {
        const group = await this.getGroup(groupId);
        const memberIdx = group.members.findIndex((member) => member.id === memberId);
        if (memberIdx == -1) {
            throw new Error("Member not found");
        }
        group.members.splice(memberIdx, 1);
        await this.groupRepository.save(group);
        const cachedGroup = this.cachedGroups.get(groupId)!;
        const cachedMemberIdx = cachedGroup.members.findIndex((m) => m = memberId);
        cachedGroup?.removeMember(cachedMemberIdx);
    }

    getGroupFingerprint(groupId: number): string {
        const cachedGroup = this.cachedGroups.get(groupId)!;
        return cachedGroup?.root.toString();
    }

    async createSignal(groupId: number, memberId: string, signalMsg: string, proof: string) {
        const group = await this.getGroup(groupId);
        const member = group.members.find((m) => m.id === memberId);
        if (!member) {
            throw new Error("Member not found");
        }
        const signal = new Signal();
        signal.proof = proof;
        signal.signalMsg = signalMsg;
        signal.group = group;
        signal.member = member;
        const savedSignal = this.signalRepository.save(signal)
        return savedSignal;
    }

    async getAllSignals(groupId: number) {
        const signals = await this.signalRepository.find({
            where: { group: {id: groupId} },
            relations: { member: true, group: true}
        });
        if (signals.length === 0) {
            throw new Error("No signals found");
        }
        return signals;
    }

}
