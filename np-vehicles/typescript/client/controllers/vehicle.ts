// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

import { GetVehicleIdentifier, GiveVehicleKey, HasVehicleKey, Keys } from './keys';

let CurrentVehicle: any
let CurrentSeat: any
let PreviousVehicle: any
let InVehicle: any
let curVehicle: any

export function GetPedVehicleSeat(_0x4752e4: number, _0x216b28: number) {
  const _0x69b991 = GetVehicleModelNumberOfSeats(
    GetEntityModel(_0x216b28)
  )
  for (let _0x188f78 = -1; _0x188f78 < _0x69b991 - 1; _0x188f78 += 1) {
    const _0xbfe1c2 = GetPedInVehicleSeat(_0x216b28, _0x188f78)
    if (_0xbfe1c2 && _0xbfe1c2 === _0x4752e4) {
      return _0x188f78
    }
  }
}

export async function InitVehicle() {
  const plyPedid = PlayerPedId()
  CurrentVehicle = GetVehiclePedIsIn(plyPedid, false)
  CurrentSeat = CurrentVehicle
    ? GetPedVehicleSeat(
        plyPedid,
        CurrentVehicle
      )
    : null
}

export function GetVehicleMetadata(_0x4b8a92: any, _0x5a6d76: any) {
  const _0x513d91 = Entity(_0x4b8a92)
  if (_0x513d91) {
    const _0x199246 = _0x513d91.state.data
    if (_0x199246) {
      return _0x5a6d76 ? _0x199246[_0x5a6d76] : _0x199246
    }
  } else {
    return null
  }
}

export function UpdateCurrentVehicle() {
  const _0x5c66ac = PlayerPedId()
  PreviousVehicle = CurrentVehicle
  CurrentVehicle = GetVehiclePedIsIn(_0x5c66ac, false)
  CurrentSeat = CurrentVehicle
    ? GetPedVehicleSeat(_0x5c66ac, CurrentVehicle)
    : null
  InVehicle = !!CurrentVehicle
}

export function TurnOnEngine(_0x5f5b8b: any, _0x2d9fdc = false) {
  if (GetPedInVehicleSeat(_0x5f5b8b, -1) !== PlayerPedId()) {
    return false
  }
  const _0x421b9f = GetVehicleEngineHealth(_0x5f5b8b),
    _0x5ab47d = GetVehicleBodyHealth(_0x5f5b8b)
  if (_0x421b9f <= 150 || _0x5ab47d <= 150) {
    return emit('DoLongHudText', 'Something seems to be damaged.', 2)
  }
  if (_0x5f5b8b !== curVehicle) {
    SetVehicleUndriveable(_0x5f5b8b, false)
  } else {
    return false
  }
  return (
    SetVehicleEngineOn(_0x5f5b8b, true, _0x2d9fdc, true),
    IsVehicleEngineOn(_0x5f5b8b)
  )
}

export function TurnOffEngine(_0x1e944b: any, _0x112d85 = false) {
  if (CurrentSeat !== -1) {
    return false
  }
  return (
    SetVehicleUndriveable(_0x1e944b, true),
    SetVehicleEngineOn(_0x1e944b, false, _0x112d85, true),
    !IsVehicleEngineOn(_0x1e944b)
  )
}

export function VerifyEngineState(_0x77bf84: any) {
  const _0x218bc2 = HasVehicleKey(_0x77bf84)
  return (
    !_0x218bc2 &&
      (SetVehicleNeedsToBeHotwired(_0x77bf84, false),
      SetVehicleUndriveable(_0x77bf84, true),
      SetVehicleEngineOn(_0x77bf84, false, true, true)),
    _0x218bc2
  )
}

export async function GenerateVehicleInformation(_0x386f34: number) {
  if (GetVehicleIdentifier(_0x386f34)) {
    return
  }
  const _0x68347d = NetworkGetNetworkIdFromEntity(_0x386f34),
  _0x458e84 = GetEntityModel(_0x386f34),
  _0x2e6e2e = await RPC.execute('np:vehicles:generateVehicleInformation', _0x68347d, _0x458e84)
  return _0x2e6e2e
}

RegisterCommand('+engineOn', () => {
    if (IsPauseMenuActive()) {
      return
    }
    const _0x6d1670 = GetVehiclePedIsIn(PlayerPedId(), false)
    _0x6d1670 && DoesEntityExist(_0x6d1670) && TurnOnEngine(_0x6d1670)
  },
  false
)
RegisterCommand('-engineOn', () => {}, false)
RegisterCommand('+engineOff', () => {
    if (IsPauseMenuActive()) {
      return
    }
    const _0x4b48dc = GetVehiclePedIsIn(PlayerPedId(), false)
    _0x4b48dc && DoesEntityExist(_0x4b48dc) && TurnOffEngine(_0x4b48dc)
  },
  false
)
RegisterCommand('-engineOff', () => {}, false)
globalThis.exports['np-keybinds'].registerKeyMapping(
  '',
  'Vehicle',
  'Engine On',
  '+engineOn',
  '-engineOn',
  'IOM_WHEEL_UP',
  false,
  'MOUSE_WHEEL'
)
globalThis.exports['np-keybinds'].registerKeyMapping(
  '',
  'Vehicle',
  'Engine Off',
  '+engineOff',
  '-engineOff',
  'IOM_WHEEL_DOWN',
  false,
  'MOUSE_WHEEL'
)

globalThis.exports('GetVehicleMetadata', GetVehicleMetadata)

export function SetVehicleMetadata(_0x2c9752: any, _0x4bf9a1: any, _0x17d82c: any) {
  const _0x4bf5ad = Number(_0x2c9752)
  switch (_0x4bf9a1) {
    case 'fakePlate':
      DecorExistOn(_0x4bf5ad, 'fakePlate')
        ? DecorSetBool(_0x4bf5ad, 'fakePlate', _0x17d82c)
        : false
      break
    case 'harness':
      DecorExistOn(_0x4bf5ad, 'harness')
        ? DecorSetInt(_0x4bf5ad, 'harness', _0x17d82c)
        : false
      break
    case 'hasCarBomb':
      DecorExistOn(_0x4bf5ad, 'hasCarBomb')
        ? DecorSetBool(_0x4bf5ad, 'hasCarBomb', _0x17d82c)
        : false
      break
    case 'minSpeed':
      DecorExistOn(_0x4bf5ad, 'minSpeed')
        ? DecorSetInt(_0x4bf5ad, 'minSpeed', _0x17d82c)
        : false
      break
    case 'ticksBeforeExplode':
      DecorExistOn(_0x4bf5ad, 'ticksBeforeExplode')
        ? DecorSetInt(_0x4bf5ad, 'ticksBeforeExplode', _0x17d82c)
        : false
      break
    case 'ticksForRemoval':
      DecorExistOn(_0x4bf5ad, 'ticksForRemoval')
        ? DecorSetInt(_0x4bf5ad, 'ticksForRemoval', _0x17d82c)
        : false
      break
  }
}

globalThis.exports('SetVehicleMetadata', SetVehicleMetadata)
