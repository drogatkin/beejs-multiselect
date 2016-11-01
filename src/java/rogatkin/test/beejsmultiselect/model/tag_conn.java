package rogatkin.test.beejsmultiselect.model;

import java.util.Date;

import org.aldan3.annot.DBField;
import org.aldan3.annot.DataRelation;
import org.aldan3.annot.FormField;
import org.aldan3.annot.FormField.FieldType;

import com.beegman.webbee.util.SimpleCoordinator;
// TODO insert it conditionally when drop downs requested
import com.beegman.webbee.util.GenericResourceOptions;

@DataRelation
public class tag_conn extends SimpleCoordinator<BeejsmultiselectModel> {
	public tag_conn(BeejsmultiselectModel m) {
		super(m);
	}

	@DBField(index= true)
	public long book_id;

	@DBField(index= true)
	public long tag_id;

	@DBField
	public Date end_date;

}
         