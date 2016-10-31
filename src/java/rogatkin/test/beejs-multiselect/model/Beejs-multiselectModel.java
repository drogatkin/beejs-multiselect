// Webbee (C) 2016 Dmitriy Rogatkin
///////   application model class   //////////
// TODO modify the file for the application purpose
package rogatkin.test.beejs-multiselect.model;

import javax.sql.DataSource;
import org.aldan3.data.DOService;
import org.aldan3.model.Log;

import com.beegman.webbee.model.AppModel;
import com.beegman.webbee.model.Auth;
import com.beegman.webbee.base.BaseBehavior;

import rogatkin.test.beejs-multiselect.model.util.Beejs-multiselectBehavior;
public class Beejs-multiselectModel extends AppModel {

	@Override
	public String getAppName() {
		return "Beejs-multiselect";
	}
	
	@Override
	protected String getServletName() {
		return "beejs-multiselect servlet";
	}
 
	@Override
	protected DOService createDataService(DataSource datasource) {
		return new DOService(datasource) {

                };
        }

	@Override
        public BaseBehavior getCommonBehavior() {
		return new Beejs-multiselectBehavior ();
	}

	@Override
	protected void initServices() {
		super.initServices();
	}

}