

export function GetVehicleExtras(_0x101fb2: number) {
    const _0x35704f = []
    for (let _0x16596a = 0; _0x16596a < 12; _0x16596a += 1) {
      IsVehicleExtraTurnedOn(_0x101fb2, _0x16596a) &&
        _0x35704f.push(_0x16596a)
    }
    return _0x35704f
}

export function SetVehicleExtras(_0x4af418: number, _0x3b174c: any[]) {
    for (let _0x393c96 = 0; _0x393c96 < 12; _0x393c96 += 1) {
      const _0x3b945f = _0x3b174c.some(
        (_0x2e51ab) => _0x2e51ab === _0x393c96
      )
      SetVehicleExtra(_0x4af418, _0x393c96, !_0x3b945f)
    }
}

export function GetVehicleNeons(_0x40dd02: number) {
    return {
        left: IsVehicleNeonLightEnabled(_0x40dd02, 0),
        right: IsVehicleNeonLightEnabled(_0x40dd02, 1),
        front: IsVehicleNeonLightEnabled(_0x40dd02, 2),
        back: IsVehicleNeonLightEnabled(_0x40dd02, 3),
    }
}

export function GetVehicleWheelFitment(vehicle: any) {
    return RPC.execute("np:vehicles:GetVehicleWheelFitment", vehicle)
}

export function GetVehicleAfterMarket(vehicle: any, pType: any) {
    return RPC.execute("np:vehicles:GetVehicleAfterMarket", vehicle, pType)
}

export function SetVehicleNeons(_0x387aba: number, _0x3b1123: { left: boolean; right: boolean; front: boolean; back: boolean }) {
    if (_0x3b1123.left) {
      SetVehicleNeonLightEnabled(_0x387aba, 0, _0x3b1123.left)
    }
    if (_0x3b1123.right) {
      SetVehicleNeonLightEnabled(_0x387aba, 1, _0x3b1123.right)
    }
    if (_0x3b1123.front) {
      SetVehicleNeonLightEnabled(_0x387aba, 2, _0x3b1123.front)
    }
    if (_0x3b1123.back) {
      SetVehicleNeonLightEnabled(_0x387aba, 3, _0x3b1123.back)
    }
}

export function GetVehicleColor(_0xf0e398: number, _0x3c4492: string) {
    switch (_0x3c4492) {
      case 'primary': {
        return GetVehicleColours(_0xf0e398)[0]
      }
      case 'secondary': {
        return GetVehicleColours(_0xf0e398)[1]
      }
      case 'pearlescent': {
        return GetVehicleExtraColours(_0xf0e398)[0]
      }
      case 'wheels': {
        return GetVehicleExtraColours(_0xf0e398)[1]
      }
      case 'tyre': {
        const [_0x2d73d4, _0x4eae53, _0x57c50b] =
          GetVehicleTyreSmokeColor(_0xf0e398)
        return {
          r: _0x2d73d4,
          g: _0x4eae53,
          b: _0x57c50b,
        }
      }
      case 'neon': {
        const [_0x12bcd8, _0xb2308e, _0x31d916] =
          GetVehicleNeonLightsColour(_0xf0e398)
        return {
          r: _0x12bcd8,
          g: _0xb2308e,
          b: _0x31d916,
        }
      }
      case 'xenon': {
        return GetVehicleXenonLightsColour(_0xf0e398)
      }
      case 'dashboard': {
        return GetVehicleDashboardColour(_0xf0e398)
      }
      case 'interior': {
        return GetVehicleInteriorColour(_0xf0e398)
      }
    }
}

export function SetVehicleColor(_0x1e7aea: number, _0x4edb74: string, _0x5231fe: any) {
    switch (_0x4edb74) {
      case 'primary': {
        const [_0x11ba29, _0x2ad143] = GetVehicleColours(_0x1e7aea)
        return SetVehicleColours(_0x1e7aea, _0x5231fe, _0x2ad143)
      }
      case 'secondary': {
        const [_0x109208] = GetVehicleColours(_0x1e7aea)
        return SetVehicleColours(_0x1e7aea, _0x109208, _0x5231fe)
      }
      case 'pearlescent': {
        const [_0x196e52, _0x1b181d] = GetVehicleExtraColours(_0x1e7aea)
        return SetVehicleExtraColours(_0x1e7aea, _0x5231fe, _0x1b181d)
      }
      case 'wheels': {
        const [_0x5704c6] = GetVehicleExtraColours(_0x1e7aea)
        return SetVehicleExtraColours(_0x1e7aea, _0x5704c6, _0x5231fe)
      }
      case 'tyre': {
        return SetVehicleTyreSmokeColor(
          _0x1e7aea,
          _0x5231fe.r,
          _0x5231fe.g,
          _0x5231fe.b
        )
      }
      case 'neon': {
        return SetVehicleNeonLightsColour(
          _0x1e7aea,
          _0x5231fe.r,
          _0x5231fe.g,
          _0x5231fe.b
        )
      }
      case 'xenon': {
        return SetVehicleXenonLightsColour(_0x1e7aea, _0x5231fe)
      }
      case 'dashboard': {
        return SetVehicleDashboardColour(_0x1e7aea, _0x5231fe)
      }
      case 'interior': {
        return SetVehicleInteriorColour(_0x1e7aea, _0x5231fe)
      }
    }
}

export function GetVehicleAdditional(_0x145925: number, _0x4f0196: string) {
    switch (_0x4f0196) {
      case 'tint': {
        return GetVehicleWindowTint(_0x145925)
      }
      case 'neon': {
        return GetVehicleNeons(_0x145925)
      }
      case 'extras': {
        return GetVehicleExtras(_0x145925)
      }
      case 'wheelType': {
        return GetVehicleWheelType(_0x145925)
      }
      case 'oldLivery': {
        return GetVehicleLivery(_0x145925)
      }
      case 'plateIndex': {
        return GetVehicleNumberPlateTextIndex(_0x145925)
      }
    }
}

export function SetVehicleAdditional(_0x49f3be: number, _0x551e3f: string, _0x4490e5: any) {
    switch (_0x551e3f) {
      case 'tint': {
        return SetVehicleWindowTint(_0x49f3be, _0x4490e5)
      }
      case 'neon': {
        return SetVehicleNeons(_0x49f3be, _0x4490e5)
      }
      case 'extras': {
        return SetVehicleExtras(_0x49f3be, _0x4490e5)
      }
      case 'wheelType': {
        return SetVehicleWheelType(_0x49f3be, _0x4490e5)
      }
      case 'oldLivery': {
        return SetVehicleLivery(_0x49f3be, _0x4490e5)
      }
      case 'plateIndex': {
        return SetVehicleNumberPlateTextIndex(_0x49f3be, _0x4490e5)
      }
    }
}

export function GetVehicleDamage(_0x72e452: number, _0x189ab2: string) {
    switch (_0x189ab2) {
        case 'body': {
            return +GetVehicleBodyHealth(_0x72e452).toFixed(2)
        }
        case 'engine': {
            return +GetVehicleEngineHealth(_0x72e452).toFixed(2)
        }
        case 'dirt': {
            return +GetVehicleDirtLevel(_0x72e452).toFixed(2)
        }
        case 'windows': {
            const _0x3d4dc8 = []
            for (let _0x24dcad = 0; _0x24dcad < 8; _0x24dcad += 1) {
                _0x3d4dc8.push({
                index: _0x24dcad,
                broken: !IsVehicleWindowIntact(_0x72e452, _0x24dcad),
                })
            }
            return _0x3d4dc8
        }
        case 'doors': {
            const _0x293283 = []
            for (let _0x27b846 = 0; _0x27b846 < 7; _0x27b846 += 1) {
                DoesVehicleHaveDoor(_0x72e452, _0x27b846) &&
                _0x293283.push({
                    index: _0x27b846,
                    broken: IsVehicleDoorDamaged(_0x72e452, _0x27b846),
                })
            }
            return _0x293283
        }
        case 'wheels': {
            const _0x258359 = GetVehicleNumberOfWheels(_0x72e452),
                _0x128324 = []
            for (let _0x300d31 = 0; _0x300d31 < _0x258359; _0x300d31 += 1) {
                let _0x29eb4d = +GetVehicleWheelHealth(
                _0x72e452,
                _0x300d31
                ).toFixed(2)
                if (IsVehicleTyreBurst(_0x72e452, _0x300d31, false)) {
                _0x29eb4d = 0.1
                }
                _0x128324.push({
                index: _0x300d31,
                health: _0x29eb4d,
                })
            }
            return _0x128324
        }
    }
}

export function SetVehicleDamage(_0x504771: number, _0x4d3c75: string, _0x133345: any) {
    switch (_0x4d3c75) {
        case 'body': {
            return SetVehicleBodyHealth(_0x504771, Number(_0x133345))
        }
        case 'engine': {
            return SetVehicleEngineHealth(_0x504771, Number(_0x133345))
        }
        case 'dirt': {
            return SetVehicleDirtLevel(_0x504771, Number(_0x133345))
        }
        case 'windows': {
            return _0x133345.forEach((_0x3e67f7: { broken: any; index: any }) => {
                if (_0x3e67f7.broken) {
                    SmashVehicleWindow(_0x504771, Number(_0x3e67f7.index))
                }
            })
        }
        case 'doors': {
            return _0x133345.forEach((_0x5750e0: { broken: any; index: any }) => {
                _0x5750e0.broken &&
                SetVehicleDoorBroken(_0x504771, Number(_0x5750e0.index), true)
            })
        }
        case 'wheels': {
            return _0x133345.forEach((_0x556d08: { health: number; index: any }) => {
                if (_0x556d08.health < 50) {
                    SetVehicleTyreBurst(_0x504771, Number(_0x556d08.index), true, 1000)
                } else {
                    if (_0x556d08.health < 100) {
                        SetVehicleTyreBurst(_0x504771, Number(_0x556d08.index), false, 1)
                    } else {
                        SetVehicleWheelHealth(
                        _0x504771,
                        Number(_0x556d08.index),
                        _0x556d08.health
                        )
                    }
                }
            })
        }
    }
}

export function GetVehicleColors(_0x4ccdaf: number) {
    return {
        primary: GetVehicleColor(_0x4ccdaf, 'primary'),
        secondary: GetVehicleColor(_0x4ccdaf, 'secondary'),
        pearlescent: GetVehicleColor(_0x4ccdaf, 'pearlescent'),
        wheels: GetVehicleColor(_0x4ccdaf, 'wheels'),
        tyre: GetVehicleColor(_0x4ccdaf, 'tyre'),
        neon: GetVehicleColor(_0x4ccdaf, 'neon'),
        xenon: GetVehicleColor(_0x4ccdaf, 'xenon'),
        dashboard: GetVehicleColor(_0x4ccdaf, 'dashboard'),
        interior: GetVehicleColor(_0x4ccdaf, 'interior'),
    }
}

export function SetVehicleColors(_0x35de1a: number, _0xce5e9f: any) {
    for (const [_0x1f4d77, _0x4ed9b0] of Object.entries(_0xce5e9f)) {
        SetVehicleColor(_0x35de1a, _0x1f4d77, _0x4ed9b0)
    }
    _0xce5e9f.dashboard &&
        _0xce5e9f.interior === undefined &&
        SetVehicleColor(_0x35de1a, 'interior', _0xce5e9f.dashboard)
    _0xce5e9f.interior &&
        _0xce5e9f.dashboard === undefined &&
        SetVehicleColor(_0x35de1a, 'dashboard', _0xce5e9f.interior)
}

export function GetVehicleAppearance(_0x310afd: number) {
    return {
        colors: GetVehicleColors(_0x310afd),
        tint: GetVehicleAdditional(_0x310afd, 'tint'),
        neon: GetVehicleAdditional(_0x310afd, 'neon'),
        extras: GetVehicleAdditional(_0x310afd, 'extras'),
        wheelType: GetVehicleAdditional(_0x310afd, 'wheelType'),
        oldLivery: GetVehicleAdditional(_0x310afd, 'oldLivery'),
        plateIndex: GetVehicleAdditional(_0x310afd, 'plateIndex'),
    }
}

export function SetVehicleAppearance(_0x275563: number, _0x1b4187: { [s: string]: unknown } | ArrayLike<unknown>) {
    for (const [_0x6d686e, _0xf3edae] of Object.entries(_0x1b4187)) {
        if (_0x6d686e !== 'colors') {
            SetVehicleAdditional(_0x275563, _0x6d686e, _0xf3edae)
        } else {
            SetVehicleColors(_0x275563, _0xf3edae)
        }
    }
}
export function FetchVehicleDamage(_0x5a9cfb: number) {
    return {
        body: GetVehicleDamage(_0x5a9cfb, 'body'),
        engine: GetVehicleDamage(_0x5a9cfb, 'engine'),
        dirt: GetVehicleDamage(_0x5a9cfb, 'dirt'),
        windows: GetVehicleDamage(_0x5a9cfb, 'windows'),
        doors: GetVehicleDamage(_0x5a9cfb, 'doors'),
        wheels: GetVehicleDamage(_0x5a9cfb, 'wheels'),
    }
}

export function RestoreVehicleDamage(_0x56a94f: number, _0x94f78b: { [s: string]: unknown } | ArrayLike<unknown>) {
    for (const [_0x2feabe, _0x40be28] of Object.entries(_0x94f78b)) {
        SetVehicleDamage(_0x56a94f, _0x2feabe, _0x40be28)
    }
}


globalThis.exports('GetVehicleAppearance', GetVehicleAppearance)
globalThis.exports('SetVehicleAppearance', SetVehicleAppearance)
globalThis.exports('GetVehicleWheelFitment', GetVehicleWheelFitment)
globalThis.exports('GetVehicleAfterMarket', GetVehicleAfterMarket)