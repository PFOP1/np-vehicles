// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

// async function InitDamage() {}

// function GetVehicleDegradation(_0x56110e: number) {
//     if (!DoesEntityExist(_0x56110e)) {
//         return false
//     }
//     const _0x429764 = Entity(_0x56110e)
//     if (_0x429764) {
//         const _0x20c7b6 = _0x429764.state?.degradation
//             ? _0x429764.state?.degradation
//             : GetDefaultDegradation()
//         return _0x20c7b6
//     } else {
//         return GetDefaultDegradation()
//     }
// }

// globalThis.exports('GetVehicleDegradation', GetVehicleDegradation)
// function GetDefaultDegradation() {
//     return {
//         axle: 100,
//         brakes: 100,
//         clutch: 100,
//         electronics: 100,
//         injector: 100,
//         radiator: 100,
//         tyres: 100,
//         engine: 100,
//         body: 100,
//         transmission: 100,
//     }
// }

// function ShowVehicleDegradation(_0x3a9400: any, _0x238895: any) {
//     const _0x2986a6 = GetVehicleDegradation(_0x3a9400),
//     _0x297041 = (0, _0x4fd263.GetVehicleMileage)(_0x3a9400)
//     if (!_0x2986a6) {
//         return
//     }
//     const _0x4bd2fa = (0, _0x3cd642.GetVehicleRating)(_0x3a9400)
//     if (!_0x4bd2fa) {
//         return
//     }
//     let _0x5b9190 = []
//     for (const [_0x192808, _0x35cfa2] of Object.entries(_0x2986a6)) {
//         let _0x50a31a = ''
//         if (_0x238895) {
//             _0x50a31a =
//             'Current State: ' +
//             _0x35cfa2.toFixed(2) +
//             '% | Parts Required: ' +
//             Math.floor((100 - _0x35cfa2) / 10)
//         } else {
//             const _0x199ab2 =
//             _0x35cfa2 > 85
//                 ? 'Excellent Condition'
//                 : _0x35cfa2 > 75
//                 ? 'Good Condition'
//                 : _0x35cfa2 > 50
//                 ? 'Bad Condition'
//                 : _0x35cfa2 > 25
//                 ? 'Terrible Condition'
//                 : 'Absolutely Fucked'
//             _0x50a31a = _0x199ab2
//         }
//         if (_0x238895) {
//             _0x5b9190.push({
//                 title: (0, _0x3cd642.GetLocale)(_0x192808),
//                 description: _0x50a31a,
//                 action: 'np:vehicles:examineVehicleRepair',
//                 key : {
//                     name : 'fix'+_0x192808,
//                     part : _0x192808,
//                     biz : 'tuner',
//                     amount : Math.floor((100 - _0x35cfa2) / 10)
//                 }
//                 })
//         } else {
//             _0x5b9190.push({
//                 title: (0, _0x3cd642.GetLocale)(_0x192808),
//                 description: _0x50a31a,
//             })
//         }
//     }
//     _0x5b9190 = _0x5b9190.sort((_0x3af46d, _0x22b5aa) => {
//         return _0x3af46d.title.localeCompare(_0x22b5aa.title)
//     })
//     globalThis.exports['np-ui'].showContextMenu([
//         {
//             title: 'Vehicle Information',
//             description:
//             'Class: ' +
//             _0x4bd2fa.class +
//             ' | Rating: ' +
//             (_0x238895 ? _0x4bd2fa.power : 'Unknown') +
//             ' | Mileage: ' +
//             Number(_0x297041).toFixed(1),
//         },
//         {
//             title: 'Vehicle Diagnostics',
//             description: '',
//             children: _0x5b9190,
//         },
//     ])
// }

// globalThis.exports('ShowVehicleDegradation', ShowVehicleDegradation)

// function DoRandomDegradation(_0x44f8bc: any, _0x3c9669 = 2, _0x182006 = false) {
//     if (!_0x182006 && (0, _0x35020f.GetRandom)(100) > 20) {
//         return
//     }
//     if (!_0x3c53fb.has(_0x44f8bc)) {
//         _0x3c53fb.set(_0x44f8bc, GetVehicleDegradation(_0x44f8bc))
//     }
//     const _0x57cbd6 = _0x3c53fb.get(_0x44f8bc)
//     for (const [_0x64aa98] of Object.entries(_0x57cbd6)) {
//         _0x57cbd6[_0x64aa98] = +(
//             _0x57cbd6[_0x64aa98] - (0, _0x35020f.GetRandom)(_0x3c9669)
//         ).toFixed(2)
//     }
//     _0x3f9bb3(_0x44f8bc)
// }
// async function SaveDegradation(_0x2ffabe) {
//     const _0x349ac6 = _0x3c53fb.get(_0x2ffabe)
//     if (!_0x349ac6) {
//         return
//     }
//     const _0x517cc3 = NetworkGetNetworkIdFromEntity(_0x2ffabe),
//     _0x3e6462 = await RPC.execute('np:vehicles:addDegradation', _0x517cc3, _0x349ac6)
//     _0x3e6462 && _0x3c53fb.delete(_0x2ffabe)
// }

// function DoRandomTyreDamage(_0x1d9312, _0x2ff4bb, _0x2c90b8, _0x405c09) {
//     const _0x94fb6d = GetVehicleWheelHealth(_0x1d9312, _0x2ff4bb),
//     _0x2b1682 = _0x405c09
//         ? (0, _0x35020f.GetRandom)(_0x2c90b8, _0x405c09)
//         : (0, _0x35020f.GetRandom)(_0x2c90b8),
//     _0x465223 = _0x94fb6d - _0x2b1682
//     return (
//     SetVehicleWheelHealth(_0x1d9312, _0x2ff4bb, _0x465223),
//     _0x465223 < 300 &&
//         !IsVehicleTyreBurst(_0x1d9312, _0x2ff4bb, false) &&
//         SetVehicleTyreBurst(_0x1d9312, _0x2ff4bb, true, 100),
//     _0x465223
//     )
// }
// function HasVehicleClass(_0x4c3cbc) {
//     return (
//         _0x4c3cbc === 13 ||
//         _0x4c3cbc === 14 ||
//         _0x4c3cbc === 15 ||
//         _0x4c3cbc === 16
//     )
// }
// let _0x1ecbb6 = 0,
//     _0x398771 = false
// const _0xda90ef = {
//     axle: [['fTractionBiasFront', false]],
//     brakes: [
//         ['fBrakeForce', true],
//         ['fHandBrakeForce', true],
//     ],
//     clutch: [['fClutchChangeRateScaleUpShift', true]],
//     electronics: [],
//     injector: [['fInitialDriveMaxFlatVel', true]],
//     radiator: [['fEngineDamageMult', false]],
//     tyres: [['fLowSpeedTractionLossMult', false]],
//     engine: [['fInitialDriveForce', true]],
//     body: [
//         ['fDeformationDamageMult', false],
//         ['fCollisionDamageMult', false],
//     ],
//     transmission: [
//         ['fClutchChangeRateScaleDownShift', true],
//         ['fInitialDragCoeff', false],
//     ],
//     },
//     _0x3f9bb3 = (_0x308cc3) => {
//     const _0x3bdae5 = GetVehicleDegradation(_0x308cc3)
//     if (!_0x3bdae5) {
//         return
//     }
//     _0x398771 = false
//     for (const [_0x33d889, _0x514003] of Object.entries(_0xda90ef)) {
//         _0x514003.forEach((_0x36b5fc) => {
//         const _0x32578b = _0x3bdae5[_0x33d889]
//         let _0x5924fd = 1
//         if (_0x32578b <= 75) {
//             _0x398771 = true
//             _0x36b5fc[1]
//             ? (_0x5924fd -= (1 - _0x32578b / 100) / 2)
//             : (_0x5924fd += (1 - _0x32578b / 100) / 2)
//         }
//         ;(0, _0x11aa22.SetHandlingContextMultiplier)(
//             _0x308cc3,
//             _0x36b5fc[0],
//             'degradation',
//             'multiplier',
//             _0x5924fd,
//             0
//         )
//         })
//     }
//     ;(0, _0x11aa22.ApplyHandlingMultipliers)(_0x308cc3)
//     },
//     _0x4210d0 = (_0x5921aa) => {
//     const _0x1b38f4 = GetVehicleDegradation(_0x5921aa)
//     if (!_0x1b38f4) {
//         return
//     }
//     if (_0x1b38f4.brakes < 60 && (0, _0x35020f.GetRandom)(1, 4) > 3) {
//         SetVehicleBrakeLights(_0x5921aa, true)
//     }
//     if (_0x1b38f4.clutch < 60 && (0, _0x35020f.GetRandom)(1, 4) > 3) {
//         SetVehicleHandbrake(_0x5921aa, true)
//         setTimeout(() => {
//         SetVehicleHandbrake(_0x5921aa, false)
//         }, 1000)
//         SetVehicleEngineHealth(
//         _0x5921aa,
//         GetVehicleEngineHealth(_0x5921aa) - 50
//         )
//     }
//     _0x1b38f4.electronics < 60 &&
//         (SetVehicleLightMultiplier(
//         _0x5921aa,
//         (0, _0x35020f.GetRandom)(0, 10) / 10
//         ),
//         SetVehicleIndicatorLights(
//         _0x5921aa,
//         (0, _0x35020f.GetRandom)(0, 1),
//         true
//         ))
//     if (
//         _0x1b38f4.electronics < 30 &&
//         (0, _0x35020f.GetRandom)(1, 4) > 3
//     ) {
//         ;(0, _0x3ad81e.TurnOffEngine)(_0x5921aa, true)
//     }
//     _0x1b38f4.injector < 60 &&
//         (0, _0x35020f.GetRandom)(1, 4) > 3 &&
//         ((0, _0x3ad81e.TurnOffEngine)(_0x5921aa, true),
//         SetVehicleEngineHealth(
//         _0x5921aa,
//         GetVehicleEngineHealth(_0x5921aa) - 50
//         ))
//     if (
//         _0x1b38f4.injector < 30 &&
//         (0, _0x35020f.GetRandom)(1, 20) > 19
//     ) {
//         SetVehiclePetrolTankHealth(_0x5921aa, 500)
//     }
//     if (_0x1b38f4.radiator < 60 && (0, _0x35020f.GetRandom)(1, 4) > 3) {
//         SetVehicleEngineHealth(
//         _0x5921aa,
//         GetVehicleEngineHealth(_0x5921aa) - 50
//         )
//         if (_0x1b38f4.body < 50 && (0, _0x35020f.GetRandom)(1, 20) > 19) {
//         SetVehicleDoorBroken(_0x5921aa, (0, _0x35020f.GetRandom)(0, 5), false)
//         }
//         if (
//         _0x1b38f4.transmission < 40 &&
//         (0, _0x35020f.GetRandom)(1, 4) > 3
//         ) {
//         SetVehicleBurnout(_0x5921aa, true)
//         setTimeout(() => {
//             SetVehicleBurnout(_0x5921aa, false)
//         }, 2000)
//         SetVehicleEngineHealth(_0x5921aa, GetVehicleEngineHealth(_0x5921aa) - 50)
//         }
//     }
//     }
// _0x160793.DriverThread.addHook('preStart', function () {
//     ;(this.data.damage = {}), (this.data.damageTick = 0)
// })
// _0x160793.DriverThread.addHook('afterStart', function () {
//     this.data.degenTick = 0
//     _0x398771 = false
//     _0x1ecbb6 = this.data.vehicle
//     SetDisableVehiclePetrolTankDamage(this.data.vehicle, true)
//     SetVehicleEngineCanDegrade(this.data.vehicle, false)
//     _0x3f9bb3(_0x1ecbb6)
// })
// _0x160793.DriverThread.addHook('active', function () {
//     if (++this.data.damageTick > 30) {
//     this.data.damageTick = 0
//     const _0x2a4fd3 = this.data.averageSpeed * 0.00833,
//         _0x5beb0f =
//         (_0x2a4fd3 * 25) / 100 + (this.data.averageSpeed * 5) / 100,
//         _0x2c616d = GetVehicleNumberOfWheels(this.data.vehicle)
//     for (let _0x15a6f1 = 0; _0x15a6f1 < _0x2c616d; _0x15a6f1 += 1) {
//         DoRandomTyreDamage(this.data.vehicle, _0x15a6f1, _0x2a4fd3 + _0x5beb0f)
//     }
//     } else {
//     if (++this.data.degenTick > 10 && _0x398771) {
//         _0x4210d0(this.data.vehicle)
//         this.data.degenTick = 0
//     }
//     }
// })
// _0x160793.DriverThread.addHook('preStop', function () {
//     if (HasVehicleClass(this.data.vehicleClass)) {
//     return
//     }
//     SaveDegradation(this.data.vehicle)
// })
// _0x160793.DriverThread.addHook('afterStop', function () {
//     ;(_0x398771 = false),
//     (this.data.damageTick = 0),
//     (this.data.degenTick = 0)
// })