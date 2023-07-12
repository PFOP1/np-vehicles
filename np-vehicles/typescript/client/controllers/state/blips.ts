// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

interface BlipOptions {
    sprite?: number;
    color?: number;
    scale?: number;
    category?: number;
    short?: boolean;
  }
  
interface BlipMap {
    [key: string]: number;
}

const blipMap: BlipMap = {};

function addBlip(
    key: string,
    position: any,
    label?: string,
    options?: BlipOptions
    ): number {
    if (blipMap[key]) {
        removeBlip(key);
    }

    const blip = AddBlipForCoord(position.x, position.y, position.z);

    if (options) {
        if (options.sprite !== undefined) {
        SetBlipSprite(blip, options.sprite);
        }
        if (options.color !== undefined) {
        SetBlipColour(blip, options.color);
        }
        if (options.scale !== undefined) {
        SetBlipScale(blip, options.scale);
        }
        if (options.category !== undefined) {
        SetBlipCategory(blip, options.category);
        }
        if (options.short !== undefined) {
        SetBlipAsShortRange(blip, options.short);
        }
    }

    if (label) {
        BeginTextCommandSetBlipName('STRING');
        AddTextComponentString(label);
        EndTextCommandSetBlipName(blip);
    }

    blipMap[key] = blip;
    return blip;
}

function removeBlip(key: string): void {
    const blip: any = blipMap[key];
    if (!blip) {
        return;
    }

    removeBlip(blip);
    delete blipMap[key];
}

function removeAllBlips(): void {
    for (const key in blipMap) {
        removeBlip(key);
    }
}

function toggleBlip(key: string, hidden: boolean): void {
    const blip = blipMap[key];
    if (!blip) {
        return;
    }

    SetBlipAlpha(blip, hidden ? 0 : 255);
    SetBlipHiddenOnLegend(blip, hidden);
}
  
export {
    addBlip,
    removeBlip,
    removeAllBlips,
    toggleBlip,
};