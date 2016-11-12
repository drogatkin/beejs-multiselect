package rogatkin.test.beejsmultiselect.ux;

import java.util.Map;
import java.util.HashMap;
import org.aldan3.model.ProcessException;
import org.aldan3.util.Sql;
import org.aldan3.data.DODelegator;
import org.aldan3.model.DataObject;
import org.aldan3.annot.DataRelation;
import com.beegman.webbee.block.SqlTabular;

import rogatkin.test.beejsmultiselect.model.BeejsmultiselectModel;
@DataRelation(query="select ID,NAME,DESCRIPTION,AUTHOR,WRITTEN_ON from book where name like '%:name%' or author like '%:name%'", keys={"name"})
public class Books extends SqlTabular<DataObject,BeejsmultiselectModel> {
	
	@Override
	protected String getQuery(String query) {
		String t = getStringParameterValue("tag", "", 0);
		if (!t .isEmpty())
			return getTagsSearchQuery(t);
		return query;
	}
	
	@Override
	protected Object applySideEffects(Object modelData) {
		modelData = super.applySideEffects(modelData);
		if (modelData instanceof Map && !((Map)modelData).containsKey("search")) {
			//HashMap<String, String> search = new HashMap<>(2);
			//search.put("name", "tag");
			((Map)modelData).put("search_block", "insert/search.html");
		}
		return modelData;
	}
	
	String getTagsSearchQuery(String ...tags) {
		return "select book.id, book.name, book.DESCRIPTION, author, WRITTEN_ON from book join tag_conn on (book.id=book_id) join tag on (tag.id=tag_id) where tag.name in ('"
				+Sql.escapeQuote(tags[0])+"')";
	}
}
