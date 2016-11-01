package rogatkin.test.beejsmultiselect.ux;

import org.aldan3.model.ProcessException;
import org.aldan3.data.DODelegator;
import com.beegman.webbee.block.Form;
import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;
import rogatkin.test.beejsmultiselect.model.tag;

public class Tag extends Form<tag, BeejsmultiselectModel> {

	@Override
	protected tag getFormModel() {
		return new tag(getAppModel());
	}

	@Override
	protected tag loadModel(tag jdo) {
		try {
			getAppModel().getDOService().getObjectLike(new DODelegator<tag>(jdo, null, "", "id"));
                        return jdo;
		} catch (ProcessException e) {
			log("", e);
		}
                return null;
	}

	@Override
	protected Object storeModel(tag jdo) {
		DODelegator<tag> djdo = new DODelegator<>(jdo, null, "", "id");
		try {
			getAppModel().getDOService().addObject(djdo, "id", jdo.id <= 0 ? null : djdo);
			log("c/u %s", null, ""+jdo.id);
			navigation = "Tag?id="+jdo.id; // TODO set a desired target page after successful operation
		} catch (ProcessException e) {
			log("", e);
			return e;
		}
		return null;
	}

}