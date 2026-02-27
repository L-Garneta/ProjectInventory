import { getItems } from "./data-store.js";

export async function getDashboardData() {
    const items = getItems();

    const totalBarang = items.length;
    const barangKritisList = items.filter((i) => i.stok <= i.stokMin);
    const barangKritis = barangKritisList.length;

    return {
        totalBarang,
        barangKritis,
        totalMasukBulan: 0,
        totalKeluarBulan: 0,
        bulan: new Date().toLocaleString("id-ID", { month: "long", year: "numeric" }),
        barangKritisList,
    };
}