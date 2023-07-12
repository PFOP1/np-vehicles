// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

import { PolyZone } from './polyzones';
import { addBlip } from './blips';
import { Cache } from './Cache';
import * as Mods from '../mods';
import * as Appearance from '../appearance';

declare const RPC: {
    register(name: string, callback: Function): void;
    execute(name: string, ...args: any[]): void;
};

declare const RegisterUICallback: (name: string, callback: Function) => void;
let currentParkingSpot: any = {};
let previewCar: any = '';
let currentGarage: any = '';
let garages = new Map()
let garageVehicleCache = new Cache()
let IsPreviewCar = false

export async function SpawnGarageVehicle(pVin: any, pGarage: any, raid: any) {
    const { heading: heading, coords: coords } = currentParkingSpot,
      hasSpawn: any = await RPC.execute('np:vehicles:spawnGarageVehicle', pVin, pGarage,
        {
          ...coords,
          h: heading,
        }
      )
    if (hasSpawn) {
        ClearGarageVehicleCache(pGarage)
    } else {
      emit('DoLongHudText', 'Vehicle unavailable, Try again later.', 2)
    }
    return (
      (currentParkingSpot = null),
      DeleteEntity(previewCar),
      hasSpawn
    )
};

export async function InitGarages() {
    if(globalThis.exports['np-config'].IsConfigReady()){        
        const garages = globalThis.exports['np-config'].GetModuleConfig('np-vehicles:garages');
        if (garages !== undefined) {
          Object.entries(garages).forEach(([key, value]) => {
            AddGarage(key, value)
          })
          const GaragesAmount = Object.keys(garages).length
          console.log('[INIT] Garages Loaded: ' + GaragesAmount)
        } else {
          console.log('[ERROR] An error occured while loading garages.')
        }
    }
}

export function AddGarage(key: any, garage: any) {
    if (!garages.has(garage.garage_id)) {
        const coords = garage.location
          coords.length
        ? PolyZone.addBoxZone(
            garage.garage_id,
            coords.vectors,
            coords.length,
            coords.width,
            coords.options
          )
        : PolyZone.addCircleZone(
            garage.garage_id,
            coords.vectors,
            coords.width,
            coords.options
          )
        if (garage.type === 'public' && !coords.hidden) {
          ;addBlip(
              garage.garage_id,
              coords.vectors,
              garage.name,
              {
              sprite: 357,
              color: 3,
              scale: 0.8,
              category: 10,
              short: true,
              }
          )
        }
    }
    garages.set(garage.garage_id, garage)
}

export function RemoveGarage(garage_id: any) {
  return garages.delete(garage_id)
}

export function GetGarageById(garage_id: any) {
  return garages.get(garage_id)
}

export function GetAllGarages() {
  return garages
}

export async function GetGarageVehicleCache(GarageId: string) {
  if (
    garageVehicleCache.has(GarageId) &&
    !garageVehicleCache.isExpired(GarageId)
  ) {
    return garageVehicleCache.get(GarageId)
  }
  const Vehicles: any = await RPC.execute('np:vehicles:getVehicles', GarageId)
  if (Vehicles) {
    return (
      garageVehicleCache.set(GarageId, Vehicles, 120000),
      garageVehicleCache.get(GarageId)
    )
  }
  return false
}


export function ClearGarageVehicleCache(garage_id: any, isClear = false) {
    if (isClear) {
        garageVehicleCache.clear()
    } else {
        garageVehicleCache.delete(garage_id)
    }
}

export function GetGarageList() {
    const data: any = []
    return (
        garages.forEach((value: any) => {
          data.push({
            id: value.garage_id,
            name: value.name,
        })
        }),
        data
    )
}

globalThis.exports('GetGarageList', GetGarageList)

export async function HasGarageSpace(garage_id: any, license_plate: any) {
  const garageData = garage_id
      ? GetGarageById(garage_id)
      : GetGarageById(currentGarage),
      plate = GetVehicleNumberPlateText(license_plate)
  if (garageData && plate) {
    const VehicleCache = await GetGarageVehicleCache(garage_id),
    dvex1 = license_plate
        ? VehicleCache.find((data: any) => data.plate === plate)
        : false
    return dvex1 || VehicleCache.length + 1 < garageData.parking_limit
  }
}

const Delay = (time: number | undefined) => new Promise((dvex) => setTimeout(dvex, time))

async function loadAndRequestModel(anim: any) {
  const hash =
    typeof anim === 'number' ? anim : GetHashKey(anim)
  if (!HasModelLoaded(hash) && IsModelInCdimage(hash)) {
    RequestModel(hash)
    let hasLoad = false
    setTimeout(() => (hasLoad = true), 60000)
    while (!HasModelLoaded(hash) && !hasLoad) {
      await Delay(10)
    }
  }
}

async function FindCarInGarageByVIN(vin: any, garage_id: any) {
  const VehicleCache = await GetGarageVehicleCache(garage_id)
  return VehicleCache.find((result: { vin: any; }) => result.vin === vin)
}

async function PreviewCar(vin: any, garage_id: any, data: any) {
  const VehData = data
    ? data
    : await FindCarInGarageByVIN(vin, garage_id)
  if (!currentParkingSpot) {
    currentParkingSpot = GetCurrentParkingSpot(garage_id, 1)
  }
  if (VehData) {
    const model = GetHashKey(VehData.model),
      { coords: coords, heading: heading } = currentParkingSpot
    await loadAndRequestModel(model)
    const vehicle = CreateVehicle(
      model,
      coords.x,
      coords.y,
      coords.z - 50,
      heading,
      false,
      false
    )
    if (vehicle) {
      FreezeEntityPosition(vehicle, true)
      SetEntityCollision(vehicle, false, false)
      SetVehicleDoorsLocked(vehicle, 3)
      SetVehicleNumberPlateText(vehicle, VehData.plate)

      if (Mods.mods !== undefined) {
        Mods.SetMods(vehicle, Mods.mods)
      }
      if (VehData.appearance !== undefined) {
        Appearance.SetVehicleAppearance(vehicle, JSON.parse(VehData.appearance))
      }
      if (VehData.damage !== undefined) {
        Appearance.RestoreVehicleDamage(vehicle, JSON.parse(VehData.damage))
      }

      await Delay(100)
      if (DoesEntityExist(previewCar)) {
        DeleteEntity(previewCar)
      }

      SetEntityCoords(
        vehicle,
        coords.x,
        coords.y,
        coords.z,
        false,
        false,
        false,
        false
      )
      previewCar = vehicle
      SetModelAsNoLongerNeeded(model)
    }
  }
}

RegisterUICallback('np:vehicles:vehiclePreview', (data: { key: any; }, cb: (arg0: { data: {}; meta: { ok: boolean; message: string; }; }) => void) => {
  const vehicleData = data.key
  vehicleData.state === 'stored' &&
  PreviewCar(vehicleData.vin, vehicleData.garage, vehicleData?.data)
  cb({
    data: {},
    meta: {
      ok: true,
      message: '',
    },
  })
}
)

RegisterUICallback('np:vehicles:spawnVehicle', async (data: { key: any; }, cb: (arg0: { data: {}; meta: { ok: boolean; message: string; }; }) => void) => {
  const veh = data.key
  veh.state === 'stored' && currentParkingSpot
    ? SpawnGarageVehicle(veh.vin, veh.garage, veh?.raid)
    : emit('DoLongHudText', 'Vehicle unavailable', 2)
  cb({
    data: {},
    meta: {
      ok: true,
      message: '',
    },
  })
}
)

RegisterUICallback('np-ui:applicationClosed', (data: { name: string; }, cb: any) => {
  data.name === 'contextmenu' && IsPreviewCar && ((IsPreviewCar = false),
    ResetParkingSpot(),
    DeleteEntity(previewCar))
}
)

RegisterUICallback('np-vehicles:fetchParkingLogs', async (data: { key: any; }, cb: (arg0: { data: {}; meta: { ok: boolean; message: string; }; }) => void) => {
  cb({
    data: {},
    meta: {
      ok: true,
      message: '',
    },
  })
  const vehData = data.key
  DoesEntityExist(previewCar) &&
    (ResetParkingSpot(),
    DeleteEntity(previewCar))
  const ParkingLogs: any = await RPC.execute('np:vehicles:fetchParkingLogs', vehData.vin, vehData.garage),
    menuData = ParkingLogs.map((data: { cid: string; action: string; timestamp: string | number | Date; data: { engine: string; body: string; fuel: string; }; }) => {
      return {
        title:
          ' State ID: ' +
          data.cid +
          ' | Action: ' +
          data.action +
          ' | Date: ' +
          new Date(data.timestamp).toLocaleString('en-US'),
        description:
          'Engine: ' +
          data.data.engine +
          ' | Body: ' +
          data.data.body +
          ' | Fuel: ' +
          data.data.fuel,
      }
    })
  globalThis.exports['np-ui'].showContextMenu(menuData)
}
)

export async function HasAccessToGarage(pGarage: any) {
    const _0x456ed6 = pGarage
      ? GetGarageById(pGarage)
      : GetGarageById(currentGarage)
    if (!_0x456ed6) {
      return false
    }
    let _0x590524 = undefined
    switch (_0x456ed6.type) {
      case 'housing': {
        _0x590524 = await new Promise((_0x27d707) => {
          setTimeout(() => _0x27d707(false), 5000)
          emit('np:vehicles:hasHouseGarageAccess', _0x456ed6.garage_id, _0x27d707)
        })
        break
      }
      case 'business': {
        if (_0x456ed6.publicOverride) {
          _0x590524 = true
          break
        }
        const cid = exports.isPed.isPed('cid')
        const _0x453cee: any = await RPC.execute('np-business:hasGarageAccess', cid, _0x456ed6.business_id)
        if (!_0x453cee) {
          emit('DoLongHudText', "You don't have access to this parking spot.", 2)
          return
        }
        _0x590524 = await new Promise((_0x3376ce) => {
          setTimeout(() => _0x3376ce(_0x453cee), 250),
            emit('np:vehicles:hasBusinessGarageAccess',_0x456ed6.garage_id, _0x456ed6.business_id, _0x3376ce)
        })
        break
      }
      case 'shared': {
        let myjob = exports.isPed.isPed('myjob')
        let _0x154fbf = false
        if (Array.isArray(_0x456ed6.job)) {
          for (
            let _0x158ef9 = 0;
            _0x158ef9 < _0x456ed6.job.length;
            _0x158ef9++
          ) {
            myjob === _0x456ed6.job[_0x158ef9] && (_0x154fbf = true)
          }
        } else {
          myjob === _0x456ed6.job && (_0x154fbf = true)
        }
        if (!_0x154fbf) {
          emit('DoLongHudText', "You don't have access to this parking spot.", 2)
          return
        }
        _0x590524 = await new Promise((_0x26a47a) => {
          setTimeout(() => _0x26a47a(_0x154fbf), 250)
            emit('np:vehicles:hasJobGarageAccess', _0x456ed6.garage_id, _0x26a47a)
        })
        break
      }
      case 'state': {
        _0x590524 = await new Promise((_0x110253) => {
          setTimeout(() => _0x110253(false), 5000)
          emit('np:vehicles:hasStateGarageAccess', _0x456ed6.garage_id, _0x110253)
        })
        break
      }
      case 'public': {
        _0x590524 = true
      }
    }
    return _0x590524
}


export function GetCurrentParkingSpot(_0x58f42f: any, _0x425966: number) {
    const _0x55e76a = GetGarageById(_0x58f42f)
    if (_0x55e76a) {
      for (const _0x246cfe of _0x55e76a.parking_spots) {
        const _0x2d5b1c = _0x246cfe.coords
        if (
          _0x246cfe.size >= _0x425966 &&
          !IsAnyVehicleNearPoint(
            _0x2d5b1c.x,
            _0x2d5b1c.y,
            _0x2d5b1c.z,
            _0x246cfe.distance
          )
        ) {
          return _0x246cfe
        }
      }
    }
    return false
}

globalThis.exports('GetCurrentParkingSpot', GetCurrentParkingSpot)

export function FindParkingSpot(ped: any, _0x20d8b9 = false, distance: any) {
    let _0x1a6f22 = undefined,
        _0x5b2a9e: any = undefined
    if (!currentGarage) {
        return [false, _0x1a6f22]
    }
    const _0x492e00 = GetGarageById(currentGarage)
    if (_0x492e00) {
        const [x, y, z] = GetEntityCoords(ped, false)
        for (const _0x353cc6 of _0x492e00.parking_spots) {
        const _0x5afdce = GetDistanceBetweenCoords(
            _0x353cc6.coords.x,
            _0x353cc6.coords.y,
            _0x353cc6.coords.z,
            x,
            y,
            z,
            true
            ),
            _0x156792 = !IsAnyVehicleNearPoint(
            _0x353cc6.coords.x,
            _0x353cc6.coords.y,
            _0x353cc6.coords.z,
            _0x353cc6.distance
            ),
            _0x5a4405 = distance ? distance : _0x353cc6.distance
        ;(!_0x20d8b9 || _0x156792) &&
            _0x5afdce <= _0x5a4405 &&
            (!_0x1a6f22 || _0x5b2a9e > _0x5afdce) &&
            ((_0x1a6f22 = _0x353cc6), (_0x5b2a9e = _0x5afdce))
        }
    }
    if (typeof _0x1a6f22 !== 'undefined') {
        currentParkingSpot = _0x1a6f22
    }
    return [_0x1a6f22 !== undefined, _0x1a6f22]
}

globalThis.exports('FindParkingSpot', FindParkingSpot)

export function IsOnParkingSpot(_0x46c8a9: any, _0x518f58 = false, _0x1efcfa: any) {
    return FindParkingSpot(_0x46c8a9, _0x518f58, _0x1efcfa)[0]
}

globalThis.exports('IsOnParkingSpot', IsOnParkingSpot)

export function ResetParkingSpot() {
    currentParkingSpot = null
}


export async function getPlayerVehiclesByCharacterId(cid: number) {
    const PlayerVehicles = await RPC.execute('np:vehicles:getPlayerVehiclesByCharacterId', cid)
    return PlayerVehicles
}

globalThis.exports('getPlayerVehiclesByCharacterId', getPlayerVehiclesByCharacterId)

export async function OpenGarageVehicleList(_0x2ac7c5: any, _0x30d119: any, _0x2bf8b7 = false) {
  const _0x379d06 = await HasAccessToGarage(currentGarage)
  if (!_0x379d06) {
    return emit('DoLongHudText', "You don't have access to this parking spot.", 2)
  }
  if (_0x2ac7c5) {
    const [_0x26f755, _0x1f7d2b] = FindParkingSpot(PlayerPedId(), _0x2bf8b7, _0x30d119)
    _0x26f755 && (currentParkingSpot = _0x1f7d2b)
  }
  OpenGarageList(currentGarage)
}

export async function StoreVehicleInGarage(_0x2d1d46: any) {
  const _0x2f7247 = await HasAccessToGarage(currentGarage)
  if (!_0x2f7247) {
    return emit('DoLongHudText', "You don't have access to this parking spot.", 2)
  }
  const _0x4ffff9 = IsOnParkingSpot(_0x2d1d46, false, NaN)
  if (
    GetVehicleNumberOfPassengers(_0x2d1d46) > 0 ||
    !IsVehicleSeatFree(_0x2d1d46, -1)
  ) {
    return emit('DoLongHudText', 'The vehicle is not empty!', 2)
  }
  if (!_0x4ffff9) {
    return emit('DoLongHudText', 'We cannot park here!', 2)
  }
  const _0x9160bd: any = await RPC.execute('np:vehicles:storeVehicle',  NetworkGetNetworkIdFromEntity(_0x2d1d46), currentGarage)
  if (!_0x9160bd) {
    return emit('DoLongHudText', 'Cannot park the vehicle here.', 2)
  }
  _0x9160bd && ClearGarageVehicleCache(currentGarage)
}

function GetGarageVehicleList(_0x270feb: any[], _0x2845b0: any, _0x406691: any, _0x1831c1: boolean, _0x10e529: boolean) {
  let _0x19a812 = undefined
  const _0x3d36db = (_0x3b68ee: any[], _0x226e96: string | any[], _0x57abeb = false) => {
    let _0xfd3d69 = undefined
    const _0x1a7204 = _0x3b68ee.reduce((_0x2db437, _0x534065) => {
      return (
        (_0x2db437[_0x534065.model] =
          _0x2db437[_0x534065.model] || []).push(_0x534065),
        _0x2db437
      )
    }, {})
    if (_0x226e96.length > 1) {
      _0xfd3d69 = _0x5afae1(
        _0x226e96,
        _0x3b68ee,
        _0x57abeb,
        _0x1831c1,
        _0x10e529
      )
    } else {
      if (
        Object.values(_0x1a7204).some(
          (_0x99e1e5: any) => _0x99e1e5.length > 3
        )
      ) {
        const [_0x11e6aa] = _0x226e96
        _0xfd3d69 = _0x193efc(
          _0x1a7204,
          _0x11e6aa,
          _0x57abeb,
          _0x1831c1,
          _0x10e529
        )
      } else {
        const [_0x77434] = _0x226e96
        _0xfd3d69 = GetVehicleMenu(
          _0x3b68ee,
          _0x77434,
          _0x57abeb,
          _0x1831c1,
          _0x10e529
        )
      }
    }
    return _0xfd3d69
  }
  if (_0x406691) {
    const _0x307e59 = globalThis.exports.isPed.isPed('cid'),
      _0x1e79e7 = _0x270feb.filter(
        (_0x23dbb6) => _0x23dbb6.cid === _0x307e59
      ),
      _0x176c44 = _0x270feb.filter(
        (_0x21bfb2) => _0x21bfb2.cid !== _0x307e59
      )
    _0x19a812 = [
      {
        title: 'Personal Vehicles',
        description: 'List of owned vehicles.',
        key: {},
        children: _0x3d36db(_0x1e79e7, _0x2845b0, true),
      },
      {
        title: 'Shared Vehicles',
        description: 'List of shared vehicles.',
        key: {},
        children: _0x3d36db(_0x176c44, _0x2845b0, true),
      },
    ]
  } else {
    const _0x115b47 = globalThis.exports.isPed.isPed('cid'),
      _0x5ebd56 = _0x270feb.filter(
        (_0x31dfdc) => _0x31dfdc.cid === _0x115b47
      )
    _0x19a812 = _0x3d36db(_0x5ebd56, _0x2845b0)
  }
  return _0x19a812
}

function Capitalize(_0x44b749: string) {
  return _0x44b749.charAt(0).toUpperCase() + _0x44b749.slice(1)
}

function GetVehicleStatus(_0x524cbf: { engine: any; body: any; } | null | undefined) {
  return (
    'Engine: ' +
    Math.floor(
      ((_0x524cbf === null || _0x524cbf === void 0
        ? void 0
        : _0x524cbf.engine) /
        1000) *
        100
    ) +
    '% | Body: ' +
    Math.floor(
      ((_0x524cbf === null || _0x524cbf === void 0
        ? void 0
        : _0x524cbf.body) /
        1000) *
        100
    ) +
    '%'
  )
}

function GetVehicleMenu(_0x3b433e: any[], _0x52732f: any, _0x10875f: boolean, isRaid: boolean, _0x4ca168: boolean) {
  const _0x505340: any = []
  return _0x3b433e.reduce((_0x47471d: { title: string; description: string; key: { state: any; garage: any; vin: any; }; extraAction: string; children: ({ title: string; description: string; action: string; disabled: boolean; key: { state: any; garage: any; vin: any; raid: any; }; } | { title: string; description: string; action?: undefined; disabled?: undefined; key?: undefined; })[]; }[], data: { name: any; model: string | number; plate: string; state: string; garage: string; vin: any; damage: any; }) => {
    const _0x20a838: any = {
        title:'' + (data.name ? data.name : GetLabelText( GetDisplayNameFromVehicleModel(data.model))),
        description: 'Plate: ' +  data.plate + ' | ' + Capitalize(data.state),
        key: {
        state: data.state,
        garage: data.garage,
        vin: data.vin,
      },
      extraAction: 'np:vehicles:vehiclePreview',
      children: [
        {
          title: 'Take Out Vehicle',
          description: '',
          action: 'np:vehicles:spawnVehicle',
          disabled: isRaid
            ? data.state !== 'stored' &&
              data.state !== 'locked'
            : data.state !== 'stored',
          key: {
            state: data.state,
            garage: data.garage,
            vin: data.vin,
            raid: isRaid,
          },
        },
        {
          title: 'Vehicle Status',
          description:
            Capitalize(data.state) +
            ' | ' +
            GetVehicleStatus(
              data.damage ? JSON.parse(data.damage || []) : []
            ),
        },
      ],
    }
    return (
      _0x4ca168 &&
        (_0x20a838.children.push({
          title: 'Set as Display Vehicle',
          description: '',
          action: 'np-vehicles:setDisplayVehicle',
          disabled: data.state !== 'stored',
          key: {
            vin: data.vin,
            garage: data.garage,
            state: data.state,
          },
        }),
        _0x20a838.children.push({
          title: 'Remove Display Vehicle',
          description: '',
          action: 'np-vehicles:setDisplayVehicle',
          disabled: data.state !== 'showcase',
          key: {
            vin: data.vin,
            garage: data.garage,
            state: data.state,
            remove: true,
          },
        })),
      isRaid &&
        _0x20a838.children.push({
          title: 'Toggle Vehicle Lockdown',
          description: '',
          action: 'np-vehicles:toggleVehicleLockdown',
          disabled:
            data.state !== 'stored' &&
            data.state !== 'locked',
          key: {
            vin: data.vin,
            garage: data.garage,
            state: data.state,
          },
        }),
      _0x505340 &&
        _0x505340[data.model] &&
        ['pd_shared', 'pd_shared_bike'].includes(data.garage) &&
        _0x20a838.children.push({
          title: 'Retrieve Vehicle',
          description: '',
          action: 'np-vehicles:retrieveVehicle',
          disabled: data.state === 'stored',
          key: {
            vin: data.vin,
            garage: data.garage,
          },
        }),
      (_0x10875f || true) &&
        _0x20a838.children.push({
          title: 'Vehicle Parking Log',
          description: '',
          action: 'np-vehicles:fetchParkingLogs',
          key: {
            vin: data.vin,
            garage: data.garage,
            state: data.state,
          },
        }),
      _0x47471d.push(_0x20a838),
      _0x47471d
    )
  }, [])
}

function _0x193efc(_0x2b1949: ArrayLike<unknown> | { [s: string]: unknown; }, _0x4f852d: any, _0x133f7d: boolean, _0x5c7d28: boolean, _0x18fd64: boolean) {
  const _0x19059c: any = {
    npolvic: 'Crown Vics',
    npolexp: 'Explorers',
    npolchar: 'Chargers',
    npolstang: 'Mustangs',
    npolvette: 'Corvettes',
    npolchal: 'Challengers',
    npolmm: 'Motorcycles',
    emsnspeedo: 'Speedos',
    emshoe: 'Tahoes',
  }
  return Object.values(_0x2b1949).reduce((_0x568e8b: any, _0x278e59: any) => {
    const _0x3a6938 = GetVehicleMenu(
        _0x278e59.sort((_0x533d6d: { name: string; }, _0xd28799: { name: any; model: any; }) =>
          _0x533d6d.name.localeCompare(
            _0xd28799.name ? _0xd28799.name : _0xd28799.model
          )
        ),
        _0x4f852d,
        _0x133f7d,
        _0x5c7d28,
        _0x18fd64
      ),
      _0x1cd071 = ['LSPD', 'BCSO', 'SASPR', 'SASP', 'UM']
    if (_0x3a6938.length === 0) {
      return _0x568e8b
    }
    return (
      _0x568e8b.push({
        title:
          '' +
          (_0x19059c[_0x278e59[0].model] || _0x278e59[0].name
            ? _0x278e59[0].name
            : _0x278e59[0].model),
        description:
          _0x278e59.length +
          ' ' +
          (_0x278e59.length === 1 ? 'Vehicle' : 'Vehicles'),
        children: _0x3a6938,
      }),
      _0x568e8b
    )
  }, [])
}

function _0x5afae1(
  _0x206f4a: any,
  _0x3cd9e4: any[],
  _0x596e92: boolean,
  _0x3b59dc: boolean,
  _0x6def53: boolean
) {
  return _0x206f4a.reduce((_0x5906cc: { title: string; description: string; key: string; action: string; children: any; }[], _0x5dfffe: any) => {
    const _0x513a93 = GetVehicleMenu(
      _0x3cd9e4,
      _0x5dfffe,
      _0x596e92,
      _0x3b59dc,
      _0x6def53
    )
    return (
      _0x513a93 &&
        _0x5906cc.push({
          title: 'Vehicle List (' + Capitalize(_0x5dfffe) + ')',
          description: 'Stored Vehicles: ' + _0x513a93.length,
          key: '',
          action: '',
          children: _0x513a93,
        }),
      _0x5906cc
    )
  }, [])
}



async function OpenGarageList(garage_id: any) {
  const _0x53cd0b = GetGarageById(garage_id)
  if (!_0x53cd0b) {
    return
  }
  const _0x3e3bc7 = await GetGarageVehicleCache(
    garage_id
  )
  if (!_0x3e3bc7) {
    return
  }
  const _0x267c55 = currentParkingSpot.type
      ? [currentParkingSpot.type]
      : _0x53cd0b.vehicle_types,
    _0x243823 = currentParkingSpot?.display === true,
    _0x2cbd42 = GetGarageVehicleList(_0x3e3bc7, _0x267c55, _0x53cd0b.shared, false, _0x243823)
  if (_0x2cbd42.length === 0) {
    return emit('DoLongHudText', "You don't have any vehicles parked here.", 2)
  }
  IsPreviewCar = true
  globalThis.exports['np-ui'].showContextMenu([..._0x2cbd42], 'right')
}


on('np-polyzone:enter', async (zone: any) => {
    if (!garages.has(zone)) {
      return
    }
    globalThis.exports["np-ui"].showInteraction("Parking")
    currentGarage = zone
})

on('np-polyzone:exit', (zone: any) => {
    if (currentGarage !== zone) {
        return
    }
    globalThis.exports["np-ui"].hideInteraction()
    currentGarage = null
})


export interface Garage {
    getPlayerVehiclesByCharacterId(cid: number): any;
    SpawnGarageVehicle(pVin: any, pGarage: any, raid: any): any;
    InitGarages(): any;
    AddGarage(number: any, garage: any): any;
    RemoveGarage(garage_id: any): any;
    GetGarageById(garage_id: any): any;
    GetAllGarages(): any;
    GetGarageVehicleCache(GarageId: any): any;
    ClearGarageVehicleCache(_0x43789b: any, _0x591868: boolean): any;
    GetGarageList(): any;
    HasGarageSpace(_0x2a624b: any, _0x1a9f61: any): any;
    HasAccessToGarage(pGarage: any): any;
    GetCurrentParkingSpot(_0x58f42f: any, _0x425966: number): any;
    FindParkingSpot(ped: any, _0x20d8b9: boolean, distance: any): any;
    IsOnParkingSpot(_0x46c8a9: any, _0x518f58: boolean, _0x1efcfa: any): any;
    ResetParkingSpot(): any;
    GetCurrentParkingSpot(_0x58f42f: any, _0x425966: number): any;
};


setImmediate(async () => {
    await InitGarages()
})