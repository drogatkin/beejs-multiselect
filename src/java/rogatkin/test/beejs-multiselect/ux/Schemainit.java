package rogatkin.test.beejs-multiselect.ux;

import com.beegman.webbee.block.Systemsetup;
import com.beegman.webbee.model.Setup;
import rogatkin.test.beejs-multiselect.model.Beejs-multiselectModel;

public class Schemainit extends Systemsetup<Setup, Beejs-multiselectModel> {

	@Override
	protected String getDefaultModelPackage() {
             return getAppModel().getClass().getPackage().getName();
        }
}
