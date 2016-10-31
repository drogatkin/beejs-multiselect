package rogatkin.test.beejsmultiselect.ux;

import com.beegman.webbee.block.Systemsetup;
import com.beegman.webbee.model.Setup;
import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;

public class Schemainit extends Systemsetup<Setup, BeejsmultiselectModel> {

	@Override
	protected String getDefaultModelPackage() {
             return getAppModel().getClass().getPackage().getName();
        }
}
