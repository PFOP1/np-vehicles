// ----------------------------------------------------------
// --                                                      --
// --                      BY PFOP                         --
// --           Discord: https://discord.gg/36KDGgg9fB     --
// --                                                      --
// ----------------------------------------------------------

class PolyZone {
  static addBoxZone(x: any, y: any, z: any, width: any, height: any) {
    return globalThis.exports['np-polyzone'].AddBoxZone(x, y, z, width, height);
  }

  static addCircleZone(x: any, y: any, radius: any, height: any) {
    return globalThis.exports['np-polyzone'].AddCircleZone(x, y, radius, height);
  }
}


export {
    PolyZone,
};