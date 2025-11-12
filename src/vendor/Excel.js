import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

async function exportToExcelWithDropdown(data, dropdownOptionsArray, fileName = 'export.xlsx') {
  const workbook = new ExcelJS.Workbook()
  const worksheet = workbook.addWorksheet('Sheet1')

  // Add headers (assuming data is an array of objects)
  const headers = Object.keys(data[0])
  worksheet.addRow(headers)

  // Add data rows
  data.forEach((row) => {
    worksheet.addRow(Object.values(row))
  })

  dropdownOptionsArray.forEach((option) => {
    const dropdownOptions = option.options
    // Apply data validation for dropdowns
    const dropdownColumnIndex = option.column // Column B
    for (let i = 2; i <= data.length + 1; i++) {
      // Start from row 2 (after headers)
      const cell = worksheet.getCell(i, dropdownColumnIndex)
      cell.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`"${dropdownOptions.join(',')}"`]
      }
    }
  })

  // Generate and save the Excel file
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  })
  saveAs(blob, fileName)
}
export default exportToExcelWithDropdown
