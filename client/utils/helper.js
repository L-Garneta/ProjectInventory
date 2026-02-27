export function getStokClass(stok, stokMin) {
    stok = Number(stok) || 0;
    stokMin = Number(stokMin) || 0;

    if (stok === 0) return "danger";
    if (stok <= stokMin) return "warning";
    return "";
}