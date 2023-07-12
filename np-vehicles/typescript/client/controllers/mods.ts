// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

export interface Mods {
    GetMod(vehicle: any, modName: any): any;
    GetMods(vehicle: any): any;
    SetMod(vehicle: number, modName: string): any;
    SetMods(vehicle: any, mods: any): any;
}


function isToggle(modId: any) {
    return modId >= 17 && modId <= 22
}

export function GetMod(vehicle: any, modName: any) {
    const modId = GetVehicleMod(vehicle, modName);
    if (isToggle(modId)) {
        return IsToggleModOn(vehicle, modId) ? 1 : 0;
    } else {
        return GetVehicleMod(vehicle, modId);
    }
};

export function GetMods(vehicle: any) {
    const mods: any = {};
    for (const modName in mods) {
        const modId = mods[modName];
        const modValue = GetMod(vehicle, modName); // use the 'modName' argument instead of 'mod'
        mods[modName] = modValue;
    }
    return mods;
};


export function SetMod(vehicle: number, modName: string) {
    let modIndex = mods[modName];
    const modId = GetMod(vehicle, modName);
    if (isNaN(modId)) {
      console.error(`Invalid mod name: ${modName}`);
      return;
    }
  
    if (isToggle(modId)) {
      ToggleVehicleMod(vehicle, modId, Boolean(modIndex));
    } else {
      if (modIndex === 255) {
        modIndex = GetNumVehicleMods(vehicle, modId) - 1;
      }
      SetVehicleMod(vehicle, modId, modIndex, false);
    }
};

export function SetMods(vehicle: any, mod: any) {
    SetVehicleModKit(vehicle, 0);
    for (const modName in mod) {
        SetMod(vehicle, modName); // pass all three arguments to SetMod
    }
};

export const mods: any = {
    Spoilers: 0,
    FrontBumper: 1,
    RearBumper: 2,
    SideSkirt: 3,
    Exhaust: 4,
    Frame: 5,
    Grille: 6,
    Hood: 7,
    Fender: 8,
    RightFender: 9,
    Roof: 10,
    Engine: 11,
    Brakes: 12,
    Transmission: 13,
    Horns: 14,
    Suspension: 15,
    Armor: 16,
    UNK17: 17,
    Turbo: 18,
    UNK19: 19,
    TireSmoke: 20,
    UNK21: 21,
    XenonHeadlights: 22,
    FrontWheels: 23,
    BackWheels: 24,
    PlateHolder: 49,
    VanityPlates: 26,
    InteriorTrim: 27,
    Ornaments: 28,
    Dashboard: 29,
    Dials: 30,
    DoorSpeakers: 31,
    Seats: 32,
    SteeringWheel: 33,
    ShiftLeavers: 34,
    Plaques: 35,
    Speakers: 36,
    Trunk: 37,
    Hydraulics: 38,
    EngineBlock: 39,
    AirFilter: 40,
    Struts: 41,
    ArchCover: 42,
    Aerials: 43,
    ExteriorTrim: 44,
    Tank: 45,
    Windows: 46,
    UNK47: 47,
    Livery: 48,
};

