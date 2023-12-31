// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

import { DoHarnessDamage, EjectLUL, HasHarnessOn, HasSeatBeltOn, SetHarness, SetSeatBelt } from './systems/harness';
import { GetJerryCanFuelLevel, GetVehicleFuel, GetVehicleRefuelCost, RefuelVehicle } from './systems/fuel';
import { GetLicensePlate, SetVehicleFakeLicensePlate } from './licenseplate';
import { GetVehicleIdentifier, GiveVehicleKey, Keys } from './keys';
import { GetVehicleMetadata } from './vehicle';
// import { PassengerThread } from './threads/passenger';
import { DoLongHudText, GetClosetPlayer } from '../utils/tools';
import { GetRandom } from '../utils/tools';
import { DoorLockCheck } from './systems/lockpicking';
// import { DriverThread } from './driver';
import { GetMods } from './mods';
import * as Appearance from './appearance';
import * as Garage from './state/garages';
import * as Mods from './mods';
import * as Vehicle from './vehicle';
import { CanUseDegradationRepair } from './items/itemsData';
export function InitEvents(): boolean {
    return true;
}

declare const RPC: {
    register(name: string, callback: Function): any;
    execute(name: string, ...args: any[]): any;
};
  

RPC.register('SetVehicleNumberPlateText', (pNetId: any, pPlate: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return SetVehicleNumberPlateText(vehicle, pPlate)
    }
});

RPC.register('GetVehicleMod', (pNetId: number, pMod: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Mods.GetMod(vehicle, pMod)
    }
});

RPC.register('GetVehicleMods', (pNetId: number, pMods: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Mods.GetMods(vehicle)
    }
});

RPC.register('SetVehicleMod', (pNetId: number, pMod: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Mods.SetMod(vehicle, pMod)
    }
});

RPC.register('SetVehicleMods', (pNetId: number, pMods: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Mods.SetMods(vehicle, pMods)
    }
});

RPC.register('GetVehicleColor', (pNetId: number, pType: string) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.GetVehicleColor(vehicle, pType);
    }
});

RPC.register('SetVehicleColor', (pNetId: number, pType: string, pValue: any) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.SetVehicleColor(vehicle, pType, pValue);
    }
});

// RPC.register('SetVehicleColors', (pNetId: number, pColors: any) => {
//     const vehicle = NetworkGetEntityFromNetworkId(pNetId);

//     if (DoesEntityExist(vehicle)) {
//         return Appearance.SetVehicleColor(vehicle, pColors);
//     }
// });

// RPC.register('SetVehicleAdditional', (pNetId: number, pType: string) => {
//     const vehicle = NetworkGetEntityFromNetworkId(pNetId);

//     if (DoesEntityExist(vehicle)) {
//         return Appearance.SetVehicleAdditional(vehicle, pType);
//     }
// });

RPC.register('GetVehicleAdditional', (pNetId: number, pType: string, pValue: any) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.SetVehicleAdditional(vehicle, pType, pValue);
    }
});

RPC.register('GetVehicleAppearance', (pNetId: number, pData: any) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.SetVehicleAppearance(vehicle, pData);
    }
});

RPC.register('FetchVehicleDamage', (pNetId: number) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.FetchVehicleDamage(vehicle);
    }
});

RPC.register('RestoreVehicleDamage', (pNetId: number, pDamage: any) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (DoesEntityExist(vehicle)) {
        return Appearance.RestoreVehicleDamage(vehicle, pDamage);
    }
});

RPC.register('GetVehicleClassFromName', (pModel: string | number) => {
    const model = typeof pModel === 'string' ? GetHashKey(pModel) : pModel;
    return GetVehicleClassFromName(model);
});

RPC.register('GetVehicleName', (pModel: string | number) => {
    const model = typeof pModel === 'string' ? GetHashKey(pModel) : pModel;
    return GetLabelText(GetDisplayNameFromVehicleModel(model));
});

onNet('np:vehicles:setKeys', (pKeys: string[]) => {
    if (!pKeys) return;
    Keys.clear();
    pKeys.forEach((key) => Keys.add(key));
    Garage.ClearGarageVehicleCache(null, true);
});

onNet('np:vehicles:addKeys', (pVIN: string) => {
    if (!Keys.has(pVIN)) Keys.add(pVIN);
    Garage.ClearGarageVehicleCache(null, true);
});

onNet('np:vehicles:removeKeys', (pVIN: string) => {
    if (!Keys.has(pVIN)) Keys.delete(pVIN);
    Garage.ClearGarageVehicleCache(null, true);
});

onNet('np:vehicles:addSharedKeys', (pVINs: string[]) => {
    pVINs.forEach((vin) => {
        if (!Keys.has(vin)) Keys.add(vin);
    });
    Garage.ClearGarageVehicleCache(null, true);
});

onNet('np:vehicles:removeSharedKeys', (pVINs: string[]) => {
    pVINs.forEach((vin) => {
        if (Keys.has(vin)) Keys.delete(vin);
    });
    Garage.ClearGarageVehicleCache(null, true);
});

onNet('np:vehicles:addGarage', (pGarage: any) => {
    Garage.AddGarage(pGarage.garage_id, pGarage);
});

onNet('np:vehicles:removeGarage', (pGarageId: string) => {
    Garage.RemoveGarage(pGarageId);
});

onNet('np:vehicles:updateGarage', (pGarage: any) => {
    Garage.AddGarage(pGarage.garage_id, pGarage);
});

// onNet('np:vehicles:parkingSpotUpdated', (pGarageId: string, pSpotId: number, pChanges: any) => {
//     Garage.EditParkingSpot(pGarageId, pSpotId, pChanges);
// });

// onNet('np:vehicles:parkingSpotDeleted', (pGarageId: string, pSpotId: number) => {
//     Garage.DeleteParkingSpot(pGarageId, pSpotId);
// });

// onNet('vehicle:swapSeat', (pSenp: number) => Vehicle.SwapVehicleSeat(pSeat));

onNet('vehicle:toggleEngine', (pVehicle?: number) => {
    const vehicle = pVehicle ? pVehicle : GetVehiclePedIsIn(PlayerPedId(), false);
    const engineState:boolean = IsVehicleEngineOn(vehicle);

    if (engineState === true)
    {
        Vehicle.TurnOffEngine(vehicle);
    }
    else
    {
        Vehicle.TurnOnEngine(vehicle);
    }
});

// onNet('vehicle:giveKey', (pArgs: never, pVehicle?: number) => {
//     const vehicle = pVehicle ? pVehicle : exports['np-target'].GetCurrentEntity();
//     const playerPed: any = PlayerPedId();

//     if (IsPedInAnyVehicle(playerPed, false)) {
//         const currentVehicle = vehicle ? vehicle : GetVehiclePedIsIn(playerPed, false);
//         const vehicleSeats = GetVehicleModelNumberOfSeats(GetEntityModel(currentVehicle));

//         for (let i = -1; i < vehicleSeats - 1; i += 1)
//         {
//             const ped = GetPedInVehicleSeat(currentVehicle, i);

//             if (ped && ped !== playerPed) GiveVehicleKey(currentVehicle, GetPlayerServerId(NetworkGetPlayerIndexFromPed(ped)));
//         }

//     } else {
//         const [player, distance] = GetClosetPlayer();

//         if (player && distance <= 5) {
//             if (vehicle && vehicle !== 0) {

//             }
//         }
//     }

//     if (DoesEntityExist(pVehicle)) {
//         const vehicleIdentifier = GetVehicleIdentifier(pVehicle);
//         if (vehicleIdentifier) {
//             const currentPlate = GetVehicleNumberPlateText(pVehicle);
//             const licensePlateData = await GetLicensePlate(vehicleIdentifier);
//             const vinOrigin = vehicleIdentifier.slice(1, 3);
//             if (!licensePlateData.hasVehicleInfo || (licensePlateData.hasVehicleInfo && licensePlateData.licenseplate === currentPlate))
//                 emit('chatMessage', 'DISPATCH ', 2, `The plate does match the VIN! (${vinOrigin})`, 5000);
//             else if (licensePlateData.hasVehicleInfo && licensePlateData.licenseplate !== currentPlate)
//                 emit(
//                     'chatMessage',
//                     'DISPATCH ',
//                     3,
//                     `The plate does not match the VIN! The original license plate is ${licensePlateData.licenseplate}`,
//                     5000,
//                 );
//         } else {
//             emit('chatMessage', 'DISPATCH ', 3, `Can't find anything on this vehicle, not good. Report this to the Goverment`, 5000);
//         }
//     }
// });

onNet('vehicle:addFakePlate', async (pArgs: never, pVehicle: number) => {
    SetVehicleFakeLicensePlate(pVehicle, true);
});

onNet('vehicle:removeFakePlate', async (pArgs: never, pVehicle: number) => {
    SetVehicleFakeLicensePlate(pVehicle, false);
});

// on('vehicle:storeVehicle', async (pArgs: never, pVehicle?: number) => {
//     Garage.StoreVehicleInGarage(pVehicle);
// });

on('vehicle:garageVehicleList', async (pArgs: any) => {
    Garage.OpenGarageVehicleList(pArgs.nearby, pArgs.radius);
});

onNet('np:vehicles:sell', async (pTargetId: number, pPrice: number) => {
    const playerPed = PlayerPedId();
    const currentVehicle = GetVehiclePedIsIn(playerPed, false);
    if (GetEntityModel(currentVehicle) == GetHashKey('taxi') || GetEntityModel(currentVehicle) == GetHashKey('flatbed')) {
        return emit('DoLongHudText', `Cannot sell this vehicle`, 2);
    }
    const vehicleIdentifier = GetVehicleIdentifier(currentVehicle);
    if (vehicleIdentifier && Keys.has(vehicleIdentifier)) {
        RPC.execute('np:vehicles:sell', vehicleIdentifier, pTargetId, pPrice)
    } else {
        return emit('DoLongHudText', `No Keys for target vehicle!`, 2);
    }
});

// RPC.register('np:vehicles:getCurrentVehicleIdentifier', () => {
//     return GetCurrentVehicleIdentifier();
// });

RPC.register('IsAnyVehicleNearPoint', (pX: number, pY: number, pZ: number, pRadius: number) => {
    return IsAnyVehicleNearPoint(pX, pY, pZ, pRadius);
});

// on('vehicle:leftBennys', () => {
//     const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
//     const netId = NetworkGetNetworkIdFromEntity(vehicle);

//     if (DoesEntityExist(vehicle) && netId !== 0) {
//         const mods = GetMods(vehicle);
//         const appearance = Appearance.GetVehicleAppearance(vehicle);

//         emitNet('np:vehicles:leftBennys', netId, mods, appearance);
//     }
// });

on('Keys:addNew', (pVehicle: number) => {
    const netId = NetworkGetNetworkIdFromEntity(pVehicle);

    if (DoesEntityExist(pVehicle) && netId !== 0) {
        emitNet('np:vehicles:gotKeys', netId)
    }
});

on('vehicle:addons', (size: any) => {
    const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
    const netId = NetworkGetNetworkIdFromEntity(vehicle);
    const hash = GetEntityModel(vehicle);

    if (IsThisModelACar(hash) || IsThisModelABike(hash) || IsThisModelAQuadbike(hash)) {
        emitNet('np:vehicles:addNitro', netId, size);
    }
});

on('vehicle:addHarness', (size: any) => {
    const vehicle = GetVehiclePedIsIn(PlayerPedId(), false);
    const netId = NetworkGetNetworkIdFromEntity(vehicle);

    emitNet('np:vehicles:addHarness', netId, size)
});

// onNet('vehicle:refuel:showMenu', async (pArgs, pEntity) => {
//     const isJerryCan = pArgs.isJerryCan;

//     const fuelLevel = isJerryCan ? GetJerryCanFuelLevel() : GetVehicleFuel(pEntity);

//     const [taxLevel, pCost] = await GetVehicleRefuelCost(fuelLevel, isJerryCan ? 35 : 100);

//     const menuData = [
//         {
//             title: 'Gas Station',
//             description: `The total cost is going to be ${pCost}, including ${taxLevel}% in taxes.`,
//             action: 'vehicle:refuel:handler',
//             key: { pEntity, pCost, isJerryCan },
//         },
//     ];
//     exports['np-ui'].showContextMenu(menuData); // we can use here nh-context instead of np-ui or check uc-ui.
// });

onNet('vehicle:refuel:jerryCan', async (pArgs: any, pEntity: any) => {
    if (pEntity) {
        RefuelVehicle(pEntity, 0, true);
    }
});

let EntryAttempt: any;

let _0xf5375d: any
onNet('baseevents:enteringVehicle', (_0x3e0ca5: number, _0x4d31a6: number, _0x5e663b: number) => {
    if (_0x4d31a6 === -1 || _0x4d31a6 === 0) {
        if (_0xf5375d) {
        clearTimeout(_0xf5375d)
        }
        _0xf5375d = setTimeout(() => {
        const _0x3af534 = PlayerPedId(),
            _0x175a8d = NetworkGetEntityIsNetworked(_0x3e0ca5),
            _0x5643e1 = GetVehicleDoorAngleRatio(_0x3e0ca5, _0x4d31a6 + 1) > 0.1,
            _0x28da84 = IsPedStill(_0x3af534)
        if (
            !_0x175a8d ||
            (!_0x28da84 &&
            (_0x5643e1 || _0x5e663b === 8 || _0x5e663b === 13))
        ) {
            TaskWarpPedIntoVehicle(_0x3af534, _0x3e0ca5, _0x4d31a6)
        }
        _0xf5375d = undefined
        }, 2000)
    }
    if (_0x4d31a6 == -1 && _0x3e0ca5) {
        ;DoorLockCheck(_0x3e0ca5)
        const _0x3785d3 = IsVehicleSeatFree(_0x3e0ca5, -1) !== true
        if (_0x3785d3) {
        return
        }
        Vehicle.VerifyEngineState(_0x3e0ca5)
    }
    SetVehicleCanEngineOperateOnFire(_0x3e0ca5, false)
    }
)

onNet('baseevents:enteringAborted', () => {
    if (!EntryAttempt) return;

    const timeout = EntryAttempt;

    EntryAttempt = undefined;

    clearTimeout(timeout);
});

onNet('baseevents:enteredVehicle', (currentVehicle: number, currentSenp: number) => {
    Vehicle.UpdateCurrentVehicle();
    const vehicleModel = GetEntityModel(currentVehicle);
    if (vehicleModel == GetHashKey('taxi')) {
        console.log('me taxi');
        emit('taximeter:enteredTaxi');
    }
    if (!EntryAttempt) return;
    clearTimeout(EntryAttempt);
});

// onNet('baseevent:leftVehicle', (currentVehicle: number, currentSenp: number) => {
//     Vehicle.UpdateCurrentVehicle();

//     SetHarness(false);
//     SetSeatBelt(false);

//     const vehicleModel = GetEntityModel(currentVehicle);
//     if (GetEntityModel(currentVehicle) == GetHashKey('taxi')) {
//         emit('taximeter:ExitedTaxi');
//     }

//     if (currentSeat === -1 && DriverThread.isActive) {
//         DriverThread.stop();
//     } else if (PassengerThread.isActive) {
//         PassengerThread.stop();
//     }
// });

// onNet('baseevent:vehicleEngineOn', (currentVehicle: number, currentSenp: number) => {
//     if (currentSeat === -1 && !DriverThread.isActive) {
//         DriverThread.start();
//     } else if (CurrentSeat !== -1 && !PassengerThread.isActive) {
//         PassengerThread.start();
//     }
// });

// onNet('baseevent:vehicleEngineOff', (currentVehicle: number, currentSenp: number) => {
//     if (currentSeat === -1 && DriverThread.isActive) {
//         DriverThread.stop();
//     } else if (CurrentSeat !== -1 && PassengerThread.isActive) {
//         PassengerThread.stop();
//     }
// });

// onNet('baseevent:vehicleChangeSeat', (currentVehicle: number, currentSenp: number, previousSenp: number) => {
//     Vehicle.UpdateCurrentVehicle();

//     SetHarness(false);
//     SetSeatBelt(false);

//     if (currentSeat === -1 && !DriverThread.isActive) {
//         DriverThread.start();
//     } else if (currentSeat !== -1 && !PassengerThread.isActive) {
//         PassengerThread.start();
//     }

//     if (previousSeat === -1 && DriverThread.isActive) {
//         DriverThread.stop();
//     } else if (currentSeat === -1 && previousSeat !== -1 && PassengerThread.isActive) {
//         PassengerThread.stop();
//     }
// });

// 50 body damage impact = engine stall and 250 engine damage.
// only eject if over 80 body impact damage
// first one is the true

// onNet(
//     'baseevent:vehicleCrashed',
//     (
//         currentVehicle: number,
//         currentSenp: number,
//         currentSpead: number,
//         previousSpeed: number,
//         pVelocity: Vector3,
//         impactDamage: number,
//         heavyImpact: boolean,
//         lightImpact: boolean,
//     ) => {
//         let beltChange: number;

//         let engineDamage = 0.0;

//         if (impactDamage > 70) {
//             engineDamage = 150 + impactDamage;
//             if (impactDamage > 100) {
//                 impactDamage = 100;
//             }
//             beltChange = HasSeatBeltOn ? Math.floor(impactDamage / 3) : impactDamage;
//         }

//         const ejectLUL = beltChange ? GetRandom(150) < beltChange : false;

//         const wasJump = pVelocity.z <= -25;

//         if (ejectLUL && HasHarnessOn) {
//             DoHarnessDamage(1);
//         } else if (ejectLUL && !wasJump) {
//             EjectLUL(currentVehicle, pVelocity);
//         }

//         if (currentSeat !== -1) return;

//         const engineHealth = GetVehicleEngineHealth(currentVehicle);
//         const bodyHealth = GetVehicleBodyHealth(currentVehicle);
//         const speedDamage = (previousSpeed - currentSpeed) * 4;

//         let damage = engineHealth - engineDamage;

//         if (isNaN(damage)) return;

//         if (damage < 150 || bodyHealth < 100) {
//             damage = 150.0;
//             SetVehicleUndriveable(currentVehicle, true);
//             SetVehicleEngineOn(currentVehicle, false, true, true);
//         }

//         SetVehicleEngineHealth(currentVehicle, damage);

//         if (speedDamage < 5 || (isNaN(engineDamage) && GetRandom(0, 1) !== 1)) return;
        
//         DoRandomDegradation(currentVehicle);

//         const wheels = GetVehicleNumberOfWheels(currentVehicle);

//         for (let i = 0; i < wheels; i += 1) {
//             DoRandomTyreDamage(currentVehicle, i, wasJump ? 500 : speedDamage, wasJump ? 1000 : undefined);
//         }
//     },
// );

RPC.register('np:vehicles:getWaterHeight', () => {
    const [x, y, z] = GetEntityCoords(PlayerPedId(), false);
    return TestVerticalProbeAgainstAllWater(x, y, z, 32, -1);
});

RPC.register('np:vehicles:isModelFlyable', (pModel: number) => {
    const isHeli = IsThisModelAHeli(pModel);
    const isPlane = IsThisModelAPlane(pModel);
    return isHeli || isPlane;
});

RPC.register('np:vehicles:completeSpawn', (pNetId: number) => {
    const vehicle = NetworkGetEntityFromNetworkId(pNetId);

    if (!vehicle) return;

    const playerPed = PlayerPedId();
    const interior = GetInteriorFromEntity(playerPed);
    const roomHash = GetRoomKeyFromEntity(playerPed);

    SetVehicleOnGroundProperly(vehicle);

    if (!interior || !roomHash) return;

    ForceRoomForEntity(vehicle, interior, roomHash);
});

// on('np:vehicles:exampleVehicle', async (pParamters, pEntity, pContext) => {
//     const isAllowed = await CanUseDegradationRepair();

//     if (!isAllowed) return DoLongHudText(`I cannot examine the vehicle right now`, 2);

//     ShowVehicleIsDegradtion(pEntity);
// });
