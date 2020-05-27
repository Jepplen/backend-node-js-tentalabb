import React, {useRef, useState, useEffect} from "react";
import './App.css';


export default function Progress(props){
  const [done, updateDone] = useState(false);
  const [index, updateIndex] = useState(0);
  const [count, updateCount] = useState(0);
  const progressBar = useRef(null);
  const cancelButton = useRef(null);

  useEffect(() => {
    let i = 0;
    if (i === 0){
      i = 0.1;
      let width = 0;
      let counter = 0;
      let indexTemp = 0;
      let id = setInterval(frame, 10);

      function frame(){
        if (width >= 100){
          clearInterval(id);
          i = 0;
          props.deleteAllRun();
          updateDone(true);
        } else {
          width += 0.1;
          progressBar.current.style.width = width + "%";
          counter++;

          if (counter % 6 === 0) {
            indexTemp++;
            if (indexTemp === files.length - 1){
              indexTemp = 0;
            }
          }
          updateIndex(indexTemp);
        }
      }
    }
  }, [] );

  function moveButton(){
    let countTemp = count;
    countTemp++;
    updateCount(countTemp);

    let pos = "translateX(0)";

    if(count % 2 === 0){
      pos = "translateX(-75px)";
    } else {
        pos = "translateX(+75px)";
    }
    cancelButton.current.style.transform = pos;
  }

  function onClick(){
    props.close(!true);
    props.stop(false);
  }

  return(
    <div className="mask">
      <div className="progress">
        {!done && <p>Formatting partition: Macintosh SSD</p>}
        {!done && <p>Deleting: {files[index]}</p>}
        {done && <p>Done.</p>}
        {done && <p>Everything was successfully deleted!</p>}
        <div className="progressbar">
          <div className="progressbar_bar" ref={progressBar}></div>
        </div>
        {!done && <button className="popup__button" ref={cancelButton} onMouseEnter={moveButton}>Cancel</button>}
        {done && <button className="popup__button" onClick={onClick}>Ok</button>}
      </div>
    </div>
  );
}













































const files = ["Server 1.0", "HeraPublic Beta Kodiak10.0", "Cheetah10.1", "Puma10.2", "Jaguar10.3", "Panther10.4", "Tiger10.5", "Leopard10.6", "Snow Leopard10.7", "Lion10.8", "Mountain Lion10.9", "Mavericks10.10", "Yosemite10.11", "El Capitan10.12", "Sierra10.13", "High Sierra10.14", "Mojave10.15", "Catalina",
"macOS wordmark","Applications", "App", "StoreAutomator", "CalculatorCalendarChess", "PlayerFaceTimeFinderGame", "CenterGrapherHomeiTunes", "(history)Launchpad", "MailMessagesNews", "MusicNotesNotification", "CenterPodcastsPhoto", "BoothPhotosPreview", "RemindersSafari", "(version history)Stickies", "TextEditTime Machine",
"Discontinued", "DashboardFront", "RowiChatiPhotoi", "SyncQuickTimeSherlock", "Utilities", "Activity", "MonitorAirPort", "UtilityAppleScript", "EditorArchive", "UtilityAudio", "MIDI", "SetupBluetooth", "File ExchangeBoot", "CampColorSyncConfiguratorConsoleCrash", "ReporterDigitalColor", "MeterDirectory", "UtilityDisk", "ImageMounterDisk",
"UtilityFont", "BookGrabHelp", "ViewerImage", "CaptureInstallerKeychain", "AccessMigration", "AssistantNetwork", "UtilityODBC", "AdministratorScreen", "SharingSystem", "PreferencesSystem", "Information", "TerminalUniversal", "AccessVoiceOver", "Discontinued", "Software UpdateRemote", "Install Mac OS X", "Technology",
"user interface", "AirDropApple", "File SystemApple", "menuApple", "Push Notification", "serviceAppleScriptAquaAudio", "UnitsAVFoundation", "BonjourBundleCloudKit", "CocoaColorSyncCommand", "keyCore", "AnimationCore", "AudioCore", "DataCore", "FoundationCore", "ImageCore", "OpenGLCore", "TextCore", "VideoCUPSCover",
"FlowDarwinDockFile", "VaultFonts", "GatekeeperGrand", "Central Dispatchicnsi", "CloudI/O KitKernel", "panicKeychainlaunchdMach", "-OMenu extraMetalMission", "ControlOpenCLOption", "keyPreference", "PaneProperty", "listQuartzQuick", "LookSmart", "FoldersSpeakable", "itemsSpotlightStacksSystem", "Integrity", "ProtectionUniform", "Type Identifier", "Universal", "binaryWebKitXNUXQuartz"
];
