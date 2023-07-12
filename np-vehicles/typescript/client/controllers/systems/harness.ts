// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

/*
    just an sample for return values for some Harness functions | todo: make it decide it self..
*/

export function SetHarness() {
    return false;
}

export function SetSeatBelt() {
    return false;
}

export function HasSeatBeltOn() {
    return false;
}

export function HasHarnessOn() {
    return false;
}

export function EjectLUL(_0x2820fe: any, _0x50d1e3: any) {
    const _0x93c765 = PlayerPedId(),
      [_0x1f45bf, _0x49dd03, _0x221ce9] =
        GetOffsetFromEntityInWorldCoords(_0x2820fe, 1, 0, 1)
    SetEntityCoords(
      _0x93c765,
      _0x1f45bf,
      _0x49dd03,
      _0x221ce9,
      false,
      false,
      false,
      false
    )
    SetPedToRagdoll(_0x93c765, 5511, 5511, 0, false, false, false)
    SetEntityVelocity(_0x93c765, _0x50d1e3.x, _0x50d1e3.y, _0x50d1e3.z)
    const _0x30fdfb = Math.round(GetEntitySpeed(_0x93c765) * 1.5),
      _0x5d7e76 = GetEntityHealth(_0x93c765) - _0x30fdfb
    SetEntityHealth(_0x93c765, _0x5d7e76 >= 0 ? _0x5d7e76 : 0)
}


export function DoHarnessDamage(damage: any) {
    // const _0x1d1b86 = NetworkGetNetworkIdFromEntity(_0x528d29.CurrentVehicle)
    // if (!_0x1d1b86) {
    //   return
    // }
    // emitNet('np:vehicles:DoHarnessDamage', _0x1d1b86, _0x582c18)
    return damage;
}