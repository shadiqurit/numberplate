# Project: Bangladesh BRTA Front Number Plate Designer & A4 Print Generator

Act as a Senior Full-Stack Software Engineer, UI/UX Designer, and Print Layout Specialist.

Build a fully functional, responsive, production-ready web application named **"BRTA Number Plate Designer"**.

The application will generate accurate, print-ready front registration number plates for motorcycles and scooters based on Bangladesh BRTA's October 2026 requirements.

## 1. Technology Stack

Preferred technologies:
- Vue 3 or Nuxt 4
- TypeScript
- Tailwind CSS
- HTML5, CSS3, SVG
- jsPDF or pdf-lib for PDF generation
- Client-side rendering and printing
- No backend required for the MVP
- Support desktop and mobile devices

Use a clean, modern, professional interface.

## 2. Official Plate Specifications

### Motorcycle
- Width: 285 mm
- Height: 50 mm
- Minimum Bengali character height: 20 mm
- Background: Pure white (#FFFFFF)
- Text: Pure black (#000000)
- Registration number on one horizontal line
- No decorative elements

Example:
ঢাকা মেট্রো-ল-১১-১২২৯

### Scooter
- Width: 200 mm
- Height: 100 mm
- Minimum Bengali character height: 20 mm
- Background: Pure white
- Text: Pure black
- Arrange registration text in a readable multiline layout where necessary
- No decorative elements

Example:

ঢাকা মেট্রো-ল

১১-১২২৯

Ensure the scooter layout can satisfy minimum character-height requirements without text overflow.

Use true physical dimensions in both SVG and PDF outputs.

## 3. Number Plate Input Form

Provide the following input fields:

1. Vehicle Type:
   - Motorcycle
   - Scooter

2. Registration Area:
   - ঢাকা মেট্রো
   - চট্টগ্রাম মেট্রো
   - অন্যান্য BRTA registration areas
   - Custom area input

3. Registration Series:
   - Bengali letter input
   - Example: ল

4. Registration Number Group:
   - Example: ১১

5. Registration Serial:
   - Example: ১২২৯

6. Full Registration Number:
   - Automatically generated from selected inputs
   - Also allow manual editing

7. Plate Quantity:
   - Default: 1
   - User-selectable number

Automatically convert English digits (0–9) into Bengali digits (০–৯).

Validate the registration number and prevent invalid or missing fields.

## 4. Live Number Plate Preview

Build a real-time preview system.

Requirements:
- Preview updates immediately when input changes
- Display accurate aspect ratios
- Show actual plate dimensions
- Support Motorcycle and Scooter layouts
- Use high-quality Bengali fonts
- Proper character spacing and alignment
- No clipped text
- Ensure glyphs are at least 20 mm high in physical print
- Automatically determine a compliant font size
- Keep all registration text inside the plate boundaries

Use suitable Bengali fonts with proper glyph shaping, such as Noto Sans Bengali, after verifying their physical rendered dimensions.

The preview must visually represent the final PDF output.

## 5. A4 Paper Layout Generator

Paper dimensions:
- A4 Portrait: 210 × 297 mm
- A4 Landscape: 297 × 210 mm

Provide the following controls:

### Paper Orientation
- Portrait
- Landscape
- Auto (recommended)

### Layout Mode
- Auto Fit
- One plate per page
- Multiple plates per page
- Manual placement

### Print Quantity
- 1 plate
- 2 plates
- 3 plates
- 4 plates
- 5 plates
- 6 plates
- Custom quantity

### Spacing
- Adjustable outer margin in mm
- Adjustable horizontal and vertical gaps in mm
- Optional cutting guides outside the plate boundaries

Important:
- Never resize the plate to fit additional items.
- Maintain the real dimensions of 285 × 50 mm and 200 × 100 mm.
- Auto-calculate the maximum number of plates that fit on the A4 paper.
- Automatically create multiple pages if the requested quantity exceeds the capacity of one page.
- Disable impossible page configurations or show clear warnings.
- For motorcycle plates, use landscape orientation by default.

## 6. Multiple Number Plates on One Page

Allow users to generate multiple different registration numbers in one print batch.

Example:
1. ঢাকা মেট্রো-ল-১১-১২২৯
2. ঢাকা মেট্রো-হ-১২-৩৪৫৬
3. চট্টগ্রাম মেট্রো-ল-১৩-৪৫৬৭

Features:
- Add new plate
- Duplicate plate
- Delete plate
- Edit individual plate
- Select Motorcycle or Scooter separately for each plate
- Set quantity for each registration
- Reorder plates
- Mix different numbers and supported plate sizes within a batch

Generate an optimized layout without changing physical plate dimensions.

Show:
- Total plates
- Plates per page
- Total A4 pages
- Paper orientation
- Unused space

## 7. Print and PDF Export

Provide:
- Print A4 button
- Download PDF button
- Export individual plate as SVG
- Export individual plate as PNG

PDF requirements:
- Exact physical dimensions
- Vector-based text and outlines where possible
- Embedded Bengali fonts
- High-resolution rendering
- Correct Bengali Unicode shaping
- Print at 100% scale
- No automatic browser scaling
- No unexpected page margins
- Avoid blurry rasterized text

Browser printing:
- Use CSS @page for A4 dimensions
- Use print-specific CSS
- Hide application controls
- Avoid page breaks inside plates
- Provide instructions to disable Fit to Page and select Actual Size / 100%

Provide a calibration feature with a 100 mm ruler or reference rectangle outside the number plates, so users can verify the printed dimensions.

## 8. Main User Interface

Create a professional dashboard with:

### Left Panel: Number Plate Configuration
- Vehicle type
- Registration fields
- Quantity
- Add to print batch button

### Center Panel: Live Plate Preview
- Motorcycle/Scooter preview
- Plate dimensions
- Real-time changes

### Right Panel: A4 Print Settings
- Paper orientation
- Margins
- Spacing
- Layout mode
- Print quantity
- PDF export controls

### Bottom Section
- A4 paper preview
- Multi-page navigation
- Print batch list

Design guidelines:
- Modern and minimal
- Light theme
- Responsive layout
- Excellent Bengali typography
- Clear primary action buttons
- Professional print-shop workflow

## 9. Compliance and Validation

Implement the following rules:
- Motorcycle: exactly 285 × 50 mm
- Scooter: exactly 200 × 100 mm
- Bengali characters and numerals
- Minimum character height: 20 mm
- White background
- Black lettering
- No decorative graphics inside the registration plate

The application must not insert logos, watermarks, ornamental borders, slogans, or extra text inside the plate.

Optional cutting marks are allowed only outside the plate area.

Clearly indicate when a registration number cannot physically fit while maintaining the mandatory 20 mm character height.

Do not silently shrink text below the minimum height.

The app prepares printable artwork only; physical plates must be manufactured from the prescribed materials.

Verify official BRTA specifications and do not claim government certification or official approval for this application.

## 10. Advanced Features

Add:
- Bengali/English interface language switch
- Save recent registration numbers in localStorage
- Duplicate existing designs
- Quick reset
- Batch editing
- Keyboard shortcuts
- Light and dark application themes (printed plates always black on white)
- Live print preview
- Automatic pagination
- Zoom in/out for preview only
- Custom registration area management

## 11. Quality Assurance

Test the following scenarios:

1. One motorcycle plate on A4 landscape.
2. Multiple motorcycle plates on A4 landscape.
3. One scooter plate on A4 portrait.
4. Multiple scooter plates on A4 portrait.
5. Mixed motorcycle/scooter batch.
6. Long Bengali registration text.
7. Automatic English-to-Bengali digit conversion.
8. Multiple PDF pages.
9. Exact dimension verification with a physical ruler.
10. Bengali font embedding and shaping.
11. Browser printing without scaling.
12. Overflow prevention with the 20 mm minimum character height.

Important: 285 mm-wide plates cannot fit across A4 portrait's 210 mm width at their original orientation. Automatically choose landscape when required.

Calculate actual layout capacity geometrically rather than assuming a fixed number of plates.

## 12. Deliverables

Develop the complete working project, not just a static UI mockup.

Include:
- All application source code
- Reusable Vue components
- Number plate rendering engine
- A4 layout calculation engine
- PDF generation module
- Input validation
- Print stylesheet
- Responsive interface
- Setup instructions
- Example test data

### Final Objective

Create an accurate Bangladesh BRTA Motorcycle & Scooter Front Number Plate Designer where users can enter registration details, preview the exact plate design, choose quantities, arrange multiple plates on A4 paper, and export professional-quality, dimensionally accurate, ready-to-print PDF files.

Prioritize physical print accuracy, Bengali typography, regulatory compliance, and ease of use.
