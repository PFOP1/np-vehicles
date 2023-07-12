// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

import { AnimationTask } from './animationTask';

declare const RPC: {
    register(name: string, callback: Function): void;
    execute(name: string, ...args: any[]): void;
};

export async function initLicensePlate() {}

export async function GetLicensePlate(vehicle: number) {
  if (vehicle) {
    const plate = await RPC.execute('np:vehicles:getLicensePlate', vehicle);
    return plate;
  }
}

export async function SetVehicleFakeLicensePlate(vehicle: number, isAdding: boolean) {
  const ped = PlayerPedId();
  const taskName: any = isAdding ? 'Adding fake plates' : 'Removing fake plates';
  const animTask: any = new AnimationTask(ped, 'normal', taskName, '5000', 'anim@amb@clubhouse@tutorial@bkr_tut_ig3@', 'machinic_loop_mechandplayer');
  const taskStatus = await animTask.start();

  if (taskStatus === 100) {
    const networkId = NetworkGetNetworkIdFromEntity(vehicle);
    const result:any  = RPC.execute('np-vehicles:setFakeLicensePlate', networkId, isAdding);
    if (result) {
      emit('inventory:removeItem', 'fakeplate', 1);
    }
  }
}
