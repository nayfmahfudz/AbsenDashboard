
<template>
    <div class="table w-full p-2">
        <button @click="exportToCSV" class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        text-center
        font-bold
        p-2
        w-40
        rounded
      ">
            Download 
        </button>
        <br>
        <br>
        <br>
        <table class="w-full border">
            <thead>
                <tr class="bg-gray-50 border-b">
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            no
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Nama 
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Unit
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                    <th class="p-2 border-r cursor-pointer text-sm font-thin text-gray-500">
                        <div class="flex items-center justify-center">
                            Jabatan
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M8 9l4-4 4 4m0 6l-4 4-4-4" />
                            </svg>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>

                <tr class="bg-gray-100 text-center border-b text-sm text-gray-600" v-for="(item,index) in  items" :key="item">
                    <td class="p-2 border-r">{{ index+1 }}</td>
                    <td class="p-2 border-r">{{ item.firstName + ' ' + item.lastName }}</td>
                    <td class="p-2 border-r">{{ item.unitObj.nama_unit }}</td>
                    <td class="p-2 border-r">{{ item.jabatan }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            items: [],
            fetch_fields: {
                "No": "no",
                "Nama": {
                    callback: (item) => {
                        return `${item.firstName || ''} ${item.lastName || ''}`.trim();
                    }
                },
                "Unit": "unitObj.nama_unit",
                "Jabatan": "jabatan",
            }
        }
    },
    methods: {
        exportToCSV() {
            const items = this.itemsForExport;
            if (!items || items.length === 0) {
                return;
            }

            const delimiter = ';';
            const fields = this.fetch_fields;
            const headers = Object.keys(fields);

            const csvRows = [headers.join(delimiter)];

            items.forEach(item => {
                const row = headers.map(header => {
                    const fieldConfig = fields[header];
                    let value;

                    if (typeof fieldConfig === 'string') {
                        const path = fieldConfig.split('.');
                        let nestedValue = item;
                        for (const key of path) {
                            if (nestedValue === null || typeof nestedValue === 'undefined') {
                                nestedValue = '';
                                break;
                            }
                            nestedValue = nestedValue[key];
                        }
                        value = nestedValue;
                    } else if (typeof fieldConfig === 'object' && fieldConfig.callback) {
                        value = fieldConfig.callback(item);
                    }
                    
                    value = (value === null || typeof value === 'undefined') ? '' : value;
                    const stringValue = String(value).replace(/"/g, '""');
                    return `"${stringValue}"`;
                });
                csvRows.push(row.join(delimiter));
            });

            const csvContent = csvRows.join('\r\n');
            const bom = '\uFEFF';
            const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement("a");
            
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "Daftar Pengguna.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    },
    computed: {
        itemsForExport() {
            return this.items.map((item, index) => {
                return { ...item, no: index + 1 };
            });
        }
    },
    async created() {
         await axios.get(`http://103.170.197.186:8000/users/unit/`+JSON.parse(localStorage.user).unitObj.id).then(result=>{
           
            this.items = result.data;
        });
    }

}




</script>