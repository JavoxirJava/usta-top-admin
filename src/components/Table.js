export default function Table({ columns, data, onEdit, onDelete }) {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                        {columns.map((col) => (
                            <th
                                key={col.key}
                                className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b"
                            >
                                {col.label}
                            </th>
                        ))}
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td
                                colSpan={columns.length + 1}
                                className="px-4 py-8 text-center text-gray-500"
                            >
                                No data available
                            </td>
                        </tr>
                    ) : (
                        data.map((row) => (
                            <tr key={row.id} className="border-b hover:bg-gray-50">
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3 text-sm text-gray-900">
                                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                                    </td>
                                ))}
                                <td className="px-4 py-3 text-sm">
                                    <button
                                        onClick={() => onEdit(row)}
                                        className="text-blue-600 hover:text-blue-800 mr-3"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => onDelete(row.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

