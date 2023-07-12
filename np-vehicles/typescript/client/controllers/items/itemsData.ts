// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

//winky

export function CanUseDegradationRepair(pNetId: null) {
    //const vehicle = NetworkGetEntityFromNetworkId(pNetId);
    const playerPed = PlayerPedId();
    const veh = GetVehiclePedIsIn(playerPed, false);

    SetVehicleFixed(veh); //?0x115722B1B9C14C1C - 0x17469AA1
}