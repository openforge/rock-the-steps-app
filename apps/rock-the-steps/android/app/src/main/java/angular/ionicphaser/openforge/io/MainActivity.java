package angular.ionicphaser.openforge.io;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;
import com.openforge.capacitorgameconnect.CapacitorGameConnectPlugin;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CapacitorGameConnectPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
