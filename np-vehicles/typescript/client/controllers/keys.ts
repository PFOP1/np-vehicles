// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

export let Keys = new Set()

export async function InitKeys() {}

onNet('np:vehicles:giveKeys', async () => {
  const cid = globalThis.exports.isPed.isPed('cid')
  const PlayerVehicles: any = await RPC.execute('np:vehicles:getAllPlayerVehicles', cid)
  Object.entries(PlayerVehicles).forEach((key: any, value: any) => {
    Keys.add(value.vin)
  })
})

export function GetVehicleIdentifier(vehicle: number) {
  if (!DoesEntityExist(vehicle)) {
    return false
  }
  const _0x48c7bd = Entity(vehicle)
  if (!_0x48c7bd.state) {
    return false
  }
  const _0x4464ee = _0x48c7bd.state,
    _0x3e20e3 = _0x4464ee.vin ? _0x4464ee.vin : false
  return _0x3e20e3
}

export function GetVehicleOwner(vehicle: number) {
  if (!DoesEntityExist(vehicle)) {
    return false
  }
  const _0x180536 = Entity(vehicle)
  if (!_0x180536.state) {
    return false
  }
  const _0x63eb82 = _0x180536.state
  return _0x63eb82.owner ? _0x63eb82.owner : 0
}

export function HasVehicleKey(vehicle: any) {
  const _0x1a3faf =
    typeof vehicle === 'number' ? GetVehicleIdentifier(vehicle) : vehicle
  return Keys.has(_0x1a3faf)
}

export function GiveVehicleKey(vehicle: any, _0x19a40c: any) {
  if (Keys.size === 0) {
    return emit('DoLongHudText', 'You have no keys to give!', 2)
  }
  const _0x1dc56c =
    typeof vehicle === 'number' ? GetVehicleIdentifier(vehicle) : vehicle
  if (_0x1dc56c && Keys.has(_0x1dc56c)) {
    RPC.execute('np:vehicles:giveKey', _0x1dc56c, _0x19a40c).then(
      (_0x2895e1: any) => {
        if (_0x2895e1) {
          emit('DoLongHudText', 'You just gave the keys of your vehicle!', 1)
        }
      }
    )
  } else {
    return emit('DoLongHudText', 'No keys for target vehicle!', 2)
  }
}

export function IsVinScratched(vehicle: number) {
  if (!DoesEntityExist(vehicle)) {
    return false
  }
  const _0x20f019 = Entity(vehicle)
  if (!_0x20f019.state) {
    return false
  }
  const _0x48819a = _0x20f019.state
  return _0x48819a.vinScratched ? _0x48819a.vinScratched : false
}

globalThis.exports('GetVehicleIdentifier', GetVehicleIdentifier)
globalThis.exports('HasVehicleKey', HasVehicleKey)
globalThis.exports('IsVinScratched', IsVinScratched)