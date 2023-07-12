class AnimationTask {
    ped: number;
    type: string;
    flag: number;
    text: string;
    active: boolean;
    duration: number | { difficulty: number, gap: number }[];
    dictionary: string;
    animation: string;
    tickId: number;
    task: Promise<number> | '';

    constructor(ped: number, type: string, duration: number | { difficulty: number, gap: number }[], text: string, animation: string, dictionary: string, flag = 1) {
        this.ped = ped;
        this.type = type;
        this.flag = flag;
        this.text = text;
        this.active = false;
        this.duration = duration;
        this.dictionary = dictionary;
        this.animation = animation;
        this.tickId = 0;
        this.task = '';
    }

    async start(onStart: any) {
        if (this.active) {
            return Promise.reject('Task already active.');
        }
        this.active = true;
        onStart && onStart();

        this.tickId = setTick(async () => {
            if (this.animation && !IsEntityPlayingAnim(this.ped, this.dictionary, this.animation, 3)) {
                RequestAnimDict(this.dictionary);
                TaskPlayAnim(this.ped, this.dictionary, this.animation, -8, -8, -1, this.flag, 0, false, false, false);
            } else {
                if (!this.animation && !IsPedUsingScenario(this.ped, this.dictionary)) {
                    TaskStartScenarioInPlace(this.ped, this.dictionary, 0, true);
                }
            }
            await new Promise<void>(resolve => setTimeout(() => resolve(), 100));
        });

        this.task = '';
        if (this.type === 'skill' && Array.isArray(this.duration)) {
            this.task = new Promise<number>(async (resolve, reject) => {
                const challenges:any = this.duration;
                for (let i = 0; i < challenges.length; i++) {
                    const challenge = challenges[i];
                    const { difficulty, gap } = challenge;
                    const progress = await exports["np-ui"].taskBarSkill(difficulty, gap);
                    if (progress !== 100) {
                        return reject(progress);
                    }
                }
                resolve(100);
            });
        } else if (this.type === 'normal' && typeof this.duration === 'number') {
            this.task = exports["np-taskbar"].taskBar(this.duration, this.text);
        }
        
        return void this.stop();
    }

    stop(): void {
        if (!this.active) {
            return;
        }
        this.active = false;
        clearTick(this.tickId);
        if (!this.animation && IsPedUsingScenario(this.ped, this.dictionary)) {
            ClearPedTasks(this.ped);
            ClearPedTasksImmediately(this.ped);
        } else {
            StopAnimTask(this.ped, this.dictionary, this.animation, 3);
        }
    }

    abort(): void {
        if (!this.active) {
            return;
        }
        this.task = exports["np-taskbar"].taskBarCancel();
        this.stop();
    }
}

export {
  AnimationTask
};
