// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

export function GetVehicleFuel(pEntity: any) {
    //todo    
}

export function GetJerryCanFuelLevel() {
    //todo
}

export async function GetVehicleRefuelCost(fuelLevel: any, pArgs: any) {
    //todo
}
export async function RefuelVehicle(pEntity: any, pAmount: any, pArgs: any) {
    //todo
}

export function EmitLowFuelSound() {
    return emit('InteractSound_SV:PlayOnSource', 'Alarm3', 0.1);
}