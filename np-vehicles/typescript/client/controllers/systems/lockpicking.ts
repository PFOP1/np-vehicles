// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

import { GetVehicleIdentifier, GiveVehicleKey, HasVehicleKey } from '../keys';

interface LockpickResult {
  success: boolean;
}

interface HotwireResult {
  success: boolean;
  stage?: number;
}

interface DoorLockCheckData {
  active: boolean;
  data: {
    success: boolean;
    stage: number;
  };
}


let lockpickingInProgress = false;

export async function lockpickVehicleDoor(
  vehicle: number,
  method: string = 'lockpick',
  degenLastUsedItem: boolean = false
): Promise<LockpickResult> {
  if (lockpickingInProgress) {
    return { success: false };
  }
  lockpickingInProgress = true;

  emit('np-vehicle:client:doorLockpicking', NetworkGetNetworkIdFromEntity(vehicle));

  const taskBarSkill1 = await exports['np-ui'].taskBarSkill(15000, 3);
  if (taskBarSkill1 !== 100) {
    lockpickingInProgress = false;
    return { success: false };
  }

  const taskBarSkill2 = await exports['np-ui'].taskBarSkill(2200, 4);
  if (taskBarSkill2 !== 100) {
    lockpickingInProgress = false;
    return { success: false };
  }

  ClearPedTasksImmediately(PlayerPedId());

  const success = taskBarSkill1 === 100 && taskBarSkill2 === 100;
  if (!degenLastUsedItem) {
    emit('inventory:DegenLastUsedItem', success ? 5 : 20);
  }

  if (success) {
    const driver = GetPedInVehicleSeat(vehicle, -1);
    if (driver !== 0 && IsEntityDead(driver)) {
      SetVehicleDoorsLocked(vehicle, 0);
      setTimeout(() => SetControlNormal(0, 23, 2), 500);

      const taskBarResult = await exports['np-taskbar'].taskBar(5000, 'Taking car keys', false);
      emit('civilian:alertPolice', 20, 'lockpick', vehicle);

      if (!degenLastUsedItem) {
        exports['np-flags'].SetVehicleFlag(vehicle, 'isStolenVehicle', true);
      }

      if (taskBarResult === 100) {
        emit('vehicle:keys:addNew', vehicle);
        emit('DoLongHudText', 'Got the vehicle keys.', 1);
      }
    }
    SetVehicleDoorsLocked(vehicle, 1);
    emit('DoLongHudText', 'Vehicle Unlocked.', 1);
    emitNet('np-fx:sound:vehicles', 'unlock');
  }

  lockpickingInProgress = false;
  return { success };
}

async function HotwireVehicle(vehicle: number, _dvex1: any, _dvex2: any, cb: (arg0: { success: boolean; stage?: number; }) => void) {
    const taskbarskill1 = await globalThis.exports['np-ui'].taskBarSkill(Math.floor(Math.random() * 5000) + 5000, Math.floor(Math.random() * 5) + 10)
    if (taskbarskill1 !== 100) {
      cb({
        success: false,
        stage: 1,
      })
      return
    }
    await globalThis.exports['np-taskbar'].taskBar(5000, 'Hotwiring Stage 1 Complete')
    const taskbarskill2 = await globalThis.exports['np-ui'].taskBarSkill(Math.floor(Math.random() * 5000) + 5000, Math.floor(Math.random() * 5) + 10)
    if (taskbarskill2 !== 100) {
      cb({
        success: false,
        stage: 2,
      })
      return
    }
    await globalThis.exports['np-taskbar'].taskBar(5000, 'Hotwiring Stage 2 Complete')
    const taskbarskill3 = await globalThis.exports['np-ui'].taskBarSkill(1500, Math.floor(Math.random() * 5) + 5)
    if (taskbarskill3 !== 100) {
      cb({
        success: false,
        stage: 3,
      })
      return
    }
    await globalThis.exports['np-taskbar'].taskBar(5000, 'Hotwiring Stage 3 Complete')
    await Delay(500)
    if (taskbarskill1 === 100 && taskbarskill2 === 100 && taskbarskill3 === 100) {
      const pos = GetEntityCoords(vehicle, false),
        plyCoords = GetEntityCoords(PlayerPedId(), false)
      if (
        GetDistanceBetweenCoords(
            pos[0],
            pos[1],
            pos[2],
            plyCoords[0],
            plyCoords[1],
            plyCoords[2],
          true
        ) < 10 &&
        vehicle !== 0 &&
        GetEntitySpeed(vehicle) < 5
      ) {
        emit('vehicle:keys:addNew', vehicle)
        emit('DoLongHudText', 'Ignition Working.', 1)
        await globalThis.exports['np-flags'].SetVehicleFlag(vehicle, 'isStolenVehicle', true)
        await globalThis.exports['np-flags'].SetVehicleFlag(vehicle, 'isHotwiredVehicle', true)
        cb({
          success: true,
          stage: 3,
        })
        return
      }
      cb({ success: false })
      return
    }
}

globalThis.exports('HotwireVehicle', HotwireVehicle)

export async function DoorLockCheck(vehicle: number) {
  if (HasVehicleKey(vehicle)) {
    const seat = GetPedInVehicleSeat(vehicle, -1)
    if (seat !== 0 && !IsPedAPlayer(seat)) {
      const status = GetVehicleDoorLockStatus(vehicle)
      status === 1 && SetVehicleDoorsLocked(vehicle, 2)
    }
  }
}

const Delay = (tiem: number | undefined) => new Promise((dvextiem) => setTimeout(dvextiem, tiem))
export async function loadAnimDict(anim: string) {
    while (!HasAnimDictLoaded(anim)) {
        RequestAnimDict(anim)
        await Delay(5)
    }
}

async function lockVehicle(vehicle: number, playAnimation: boolean): Promise<void> {
    if (HasVehicleKey(vehicle)) {
      const isLocked: boolean = GetVehicleDoorLockStatus(vehicle) === 0 || GetVehicleDoorLockStatus(vehicle) === 1;
      SetVehicleDoorsLocked(vehicle, isLocked ? 2 : 1);
      if (isLocked) {
        emit('DoLongHudText', 'Vehicle Locked.', 1);
        emitNet('np-fx:sound:vehicles', 'lock');
      } else {
        emit('DoLongHudText', 'Vehicle Unlocked.', 1);
        emitNet('np-fx:sound:vehicles', 'unlock');
      }
      if (playAnimation) {
        await loadAnimDict('anim@heists@keycard@');
        TaskPlayAnim(
          PlayerPedId(),
          'anim@heists@keycard@',
          'exit',
          8,
          1,
          -1,
          48,
          0,
          false,
          false,
          false
        );
      }
    }
}

RegisterCommand('+vehicleLock', () => {
    const currentEntity: number = globalThis.exports['np-target'].GetCurrentEntity();
    let vehicle: number;
    if (currentEntity && DoesEntityExist(currentEntity)) {
      lockVehicle(currentEntity, true);
    } else {
      vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
      if (vehicle) {
        lockVehicle(vehicle, true);
      }
    }
}, false);
  
RegisterCommand('-vehicleLock', () => {}, false);

globalThis.exports['np-keybinds'].registerKeyMapping('', 'Vehicle', 'Lock Doors', '+vehicleLock', '-vehicleLock', 'L');