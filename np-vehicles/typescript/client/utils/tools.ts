// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

/*
    CONCEPT
*/

export function DoLongHudText(text: string, style: number) {
    return [text, style];
}

export function GetClosetPlayer(x: number, y: number, z: number, radius: number, p4: boolean, p5: boolean, p7: boolean, p8: boolean, pedType: number) {
    return GetClosestPed(x, y, z, radius, p4, p5, p7, p8, pedType);
}

export function PlayEntitySound(soundId: number, audioName: string, entity:any, audioRef: string, isNetwork: boolean, p5:any): void {
    return PlaySoundFromEntity(soundId, audioName, entity, audioRef, isNetwork, p5);
}

export function SyncedExecution() {
    //todo
}

export function GetPedVehicleSeat(playerPed: number, CurrentVehicle: number) {
    return GetPedInVehicleSeat(playerPed, CurrentVehicle);
}

export function GetRandom(min: number, max: number) {
    if (max === undefined) {
      max = min;
      min = 0;
    }
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// export function GetClosetPlayer() {
//     return GetClosestPed();
// }