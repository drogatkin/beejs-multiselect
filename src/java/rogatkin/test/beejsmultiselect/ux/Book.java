package rogatkin.test.beejsmultiselect.ux;

import org.aldan3.model.ProcessException;
import org.aldan3.data.DODelegator;
import com.beegman.webbee.block.Form;
import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;
import rogatkin.test.beejsmultiselect.model.book;

public class Book extends Form<book, BeejsmultiselectModel> {

	@Override
	protected book getFormModel() {
		return new book(getAppModel());
	}

	@Override
	protected book loadModel(book jdo) {
		try {
			getAppModel().getDOService().getObjectLike(new DODelegator<book>(jdo, null, "", "id"));
                        return jdo;
		} catch (ProcessException e) {
			log("", e);
		}
                return null;
	}

	@Override
	protected Object storeModel(book jdo) {
		DODelegator<book> djdo = new DODelegator<>(jdo, null, "", "id");
		try {
			getAppModel().getDOService().addObject(djdo, "id", jdo.id <= 0 ? null : djdo);
			log("c/u %s", null, ""+jdo.id);
			navigation = "Books?name="; 
		} catch (ProcessException e) {
			log("", e);
			return e;
		}
		return null;
	}

}