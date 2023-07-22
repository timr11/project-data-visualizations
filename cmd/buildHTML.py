import os
import time

from notebookjs import save_html
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler, DirModifiedEvent, FileModifiedEvent
from typing import Any
import json

path = os.path

curr_module_dir = path.dirname(path.abspath(__file__))
js_dir = path.abspath(path.join(curr_module_dir, "..", "bin"))
js_path = path.join(js_dir, "project-data-visualizations.js")
json_dir = path.abspath(path.join(curr_module_dir, "../src/py"))
elements_json_path = path.join(json_dir, "elements.json")
style_json_path = path.join(json_dir, "style.json")
layout_json_path = path.join(json_dir, "layout.json")
style_css_path = path.join(json_dir, "style.css")

files_to_monitor = [
    js_path,
    elements_json_path,
    style_json_path,
    layout_json_path,
    style_css_path,
]

class FileChangeHandler(FileSystemEventHandler):
    def on_modified(self, event: DirModifiedEvent | FileModifiedEvent):
        if event.is_directory:
            return

        assert isinstance(event, FileModifiedEvent)

        if event.src_path in files_to_monitor:
            print(f"File {path.basename(event.src_path)} has been modified. Rebuilding the HTML ...")
            buildHTML()  # Replace this with the function that executes your Python script

def createDataDict(json_dir: str) -> dict[str, Any]:
    with open(os.path.join(json_dir, "elements.json")) as cy_elements_file:
        cy_elements_json = json.load(cy_elements_file)

    with open(os.path.join(json_dir, "style.json")) as cy_style_file:
        cy_style_json = json.load(cy_style_file)

    with open(os.path.join(json_dir, "layout.json")) as cy_layout_file:
        cy_layout_json = json.load(cy_layout_file)

    return {
        "elements": cy_elements_json,
        "style": cy_style_json,
        "layout": cy_layout_json,
    }

def buildHTML():
    data = createDataDict(json_dir)

    with open(js_path, "r") as f:
        cy_graph_js = f.read()
    
    with open(style_css_path, "r") as f:
        cy_graph_css = f.read()

    css_list = [cy_graph_css, "https://unpkg.com/tippy.js@6/dist/tippy.css"]

    save_html(
        html_dest="index.html",
        library_list=[cy_graph_js],
        main_function="projectdatavisualizations.drawGraph",
        data_dict=data,
        css_list=css_list,
    )
    print("Rebuilt the HTML")

if __name__ == "__main__":

    # Build the HTML then start listening for changes
    buildHTML()

    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=json_dir)
    observer.schedule(event_handler, path=js_dir)

    observer.start()
    print("File change monitoring has started. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()
