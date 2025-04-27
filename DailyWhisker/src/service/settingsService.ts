export type ExportFormat = "json" | "xml";

export const exportSettings = (settings: {
  catBorder: string;
  catBackground: string;
  appTheme: string;
}, format: ExportFormat) => {
  let dataStr = "";
  let fileType = "";
  let fileName = "settings";

  if (format === "json") {
    dataStr = JSON.stringify({ ...settings, updatedAt: Date.now() }, null, 2);
    fileType = "application/json";
    fileName += ".json";
  } else {
    dataStr = `<settings>
  <catBorder>${settings.catBorder}</catBorder>
  <catBackground>${settings.catBackground}</catBackground>
  <appTheme>${settings.appTheme}</appTheme>
  <updatedAt>${Date.now()}</updatedAt>
</settings>`;
    fileType = "application/xml";
    fileName += ".xml";
  }

  const blob = new Blob([dataStr], { type: fileType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const importSettings = (
  file: File,
  onLoadSettings: (settings: { catBorder: string; catBackground: string; appTheme: string; }) => void
) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    const text = event.target?.result;
    if (typeof text !== "string") return;

    if (file.name.endsWith(".json")) {
      try {
        const data = JSON.parse(text);
        onLoadSettings({
          catBorder: data.catBorder || "Default",
          catBackground: data.catBackground || "Solid",
          appTheme: data.appTheme || "Light",
        });
        alert("Settings imported! Don't forget to click Save!");
      } catch (error) {
        alert("Invalid JSON file.");
      }
    } else if (file.name.endsWith(".xml")) {
      try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(text, "application/xml");

        const getValue = (tagName: string) =>
          xmlDoc.getElementsByTagName(tagName)[0]?.textContent || "";

        onLoadSettings({
          catBorder: getValue("catBorder") || "Default",
          catBackground: getValue("catBackground") || "Solid",
          appTheme: getValue("appTheme") || "Light",
        });
        alert("Settings imported! Don't forget to click Save!");
      } catch (error) {
        alert("Invalid XML file.");
      }
    }
  };
  reader.readAsText(file);
};
